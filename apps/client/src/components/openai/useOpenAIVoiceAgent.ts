import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toolsConfig, executeToolCall } from './tools';
import { toast } from '@/hooks/use-toast';
import { useOpenAIStore } from '@/stores/useOpenAIStore';

interface UseOpenAIVoiceAgentProps {
  instructions?: string;
  name?: string;
}

export function useOpenAIVoiceAgent({
  instructions = 'You are Moniewave, a helpful financial assistant. Help users manage their money through voice commands. Be concise and friendly.',
  name = 'Moniewave',
}: UseOpenAIVoiceAgentProps = {}) {
  const { messages, toolExecutions, rawEvents, addMessage, addToolExecution, addRawEvent, clearAll } = useOpenAIStore();
  
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [pendingToolCall, setPendingToolCall] = useState<{
    event: any;
    resolve: (approved: boolean) => void;
  } | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const audioLevelRef = useRef(0);
  const rafRef = useRef<number>(0);

  // Simulate audio level based on speaking state
  useEffect(() => {
    const updateLevel = () => {
      if (isSpeaking) {
        const randomVariation = Math.random() * 0.3 + 0.7;
        audioLevelRef.current += (randomVariation - audioLevelRef.current) * 0.15;
      } else {
        audioLevelRef.current *= 0.9;
      }
      setAudioLevel(audioLevelRef.current);
      rafRef.current = requestAnimationFrame(updateLevel);
    };
    updateLevel();
    return () => cancelAnimationFrame(rafRef.current);
  }, [isSpeaking]);

  const connect = useCallback(async () => {
    if (isConnected || isConnecting) return;

    setIsConnecting(true);
    setError(null);

    try {
      console.log('Fetching ephemeral token...');
      
      const { data: tokenData, error: tokenError } = await supabase.functions.invoke(
        'openai-ephemeral-token'
      );

      if (tokenError) throw tokenError;
      if (!tokenData?.client_secret?.value) {
        throw new Error('Failed to get ephemeral token');
      }

      const ephemeralKey = tokenData.client_secret.value;
      console.log('Ephemeral token received');

      if (!audioElRef.current) {
        audioElRef.current = document.createElement('audio');
        audioElRef.current.autoplay = true;
      }

      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      pc.ontrack = (e) => {
        console.log('Remote audio track received');
        if (audioElRef.current) {
          audioElRef.current.srcObject = e.streams[0];
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      pc.addTrack(stream.getTracks()[0]);

      const dc = pc.createDataChannel('oai-events');
      dcRef.current = dc;

      dc.addEventListener('open', () => {
        console.log('Data channel opened');
      });

      dc.addEventListener('message', async (e) => {
        try {
          const event = JSON.parse(e.data);
          console.log('Received event:', event);
          addRawEvent({ direction: 'received', timestamp: new Date().toISOString(), event });

          if (event.type === 'session.created') {
            const sessionConfig = {
              type: 'session.update',
              session: {
                modalities: ['text', 'audio'],
                instructions,
                voice: 'alloy',
                input_audio_format: 'pcm16',
                output_audio_format: 'pcm16',
                input_audio_transcription: {
                  model: 'whisper-1'
                },
                turn_detection: {
                  type: 'server_vad',
                  threshold: 0.5,
                  prefix_padding_ms: 300,
                  silence_duration_ms: 1000
                },
                tools: toolsConfig,
                tool_choice: 'auto'
              }
            };
            
            dcRef.current?.send(JSON.stringify(sessionConfig));
            addRawEvent({ direction: 'sent', timestamp: new Date().toISOString(), event: sessionConfig });
            console.log('Session configured with tools from tool definitions');
          }

          if (event.type === 'response.audio_transcript.delta') {
            setIsSpeaking(true);
          } else if (event.type === 'response.audio_transcript.done') {
            setIsSpeaking(false);
            if (event.transcript) {
              addMessage({
                id: `msg_${Date.now()}`,
                role: 'assistant',
                content: event.transcript,
                timestamp: new Date().toISOString(),
              });
            }
          } else if (event.type === 'conversation.item.input_audio_transcription.completed') {
            if (event.transcript) {
              addMessage({
                id: `msg_${Date.now()}`,
                role: 'user',
                content: event.transcript,
                timestamp: new Date().toISOString(),
              });
            }
          } else if (event.type === 'response.function_call_arguments.done') {
            console.log('Tool call completed:', event);
            const executionId = `exec_${Date.now()}`;
            const startTime = Date.now();
            
            // Request approval
            const approved = await new Promise<boolean>((resolve) => {
              setPendingToolCall({ event, resolve });
              
              toast({
                title: "⚠️ Tool Approval Required",
                description: `${event.name} wants to execute`,
                duration: 10000,
              });
            });
            
            if (!approved) {
              // Send a cancellation or error response
              const errorResponse = {
                type: 'conversation.item.create',
                item: {
                  type: 'function_call_output',
                  call_id: event.call_id,
                  output: JSON.stringify({ 
                    error: 'User denied tool execution',
                    status: 'cancelled'
                  })
                }
              };
              dcRef.current?.send(JSON.stringify(errorResponse));
              addRawEvent({ 
                direction: 'sent', 
                timestamp: new Date().toISOString(), 
                event: errorResponse 
              });
              setPendingToolCall(null);
              
              toast({
                title: "🚫 Tool Rejected",
                description: `${event.name} execution cancelled`,
                variant: "destructive",
                duration: 3000,
              });
              
              // Request a new response
              const responseCreate = { type: 'response.create' };
              dcRef.current?.send(JSON.stringify(responseCreate));
              addRawEvent({ 
                direction: 'sent', 
                timestamp: new Date().toISOString(), 
                event: responseCreate 
              });
              return;
            }
            
            // Show executing toast
            toast({
              title: "🔧 Tool Executing",
              description: `Running: ${event.name}`,
              duration: 3000,
            });
            
            try {
              const toolResult = await executeToolCall(event.name, JSON.parse(event.arguments));
              const duration = Date.now() - startTime;
              
              // Store the execution
              addToolExecution({
                id: executionId,
                toolName: event.name,
                arguments: JSON.parse(event.arguments),
                result: toolResult,
                timestamp: new Date().toISOString(),
                duration
              });
              
              // Show success toast
              toast({
                title: "✅ Tool Completed",
                description: toolResult.message || `${event.name} executed successfully`,
                duration: 5000,
              });
              
              // Send the result back
              const toolResponse = {
                type: 'conversation.item.create',
                item: {
                  type: 'function_call_output',
                  call_id: event.call_id,
                  output: JSON.stringify(toolResult)
                }
              };
              dcRef.current?.send(JSON.stringify(toolResponse));
              addRawEvent({ 
                direction: 'sent', 
                timestamp: new Date().toISOString(), 
                event: toolResponse 
              });
              
              // Request a new response
              const responseCreate = { type: 'response.create' };
              dcRef.current?.send(JSON.stringify(responseCreate));
              addRawEvent({ 
                direction: 'sent', 
                timestamp: new Date().toISOString(), 
                event: responseCreate 
              });
            } catch (err) {
              toast({
                title: "❌ Tool Failed",
                description: `Error executing ${event.name}`,
                variant: "destructive",
                duration: 5000,
              });
            } finally {
              setPendingToolCall(null);
            }
          }
        } catch (err) {
          console.error('Error parsing event:', err);
        }
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const baseUrl = 'https://api.openai.com/v1/realtime';
      const model = 'gpt-4o-realtime-preview-2024-12-17';
      
      console.log('Connecting to OpenAI Realtime API...');
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: 'POST',
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${ephemeralKey}`,
          'Content-Type': 'application/sdp',
        },
      });

      if (!sdpResponse.ok) {
        throw new Error(`Failed to connect: ${sdpResponse.status}`);
      }

      const answer = {
        type: 'answer' as RTCSdpType,
        sdp: await sdpResponse.text(),
      };

      await pc.setRemoteDescription(answer);

      setIsConnected(true);
      setIsConnecting(false);
      console.log('Connected successfully');
    } catch (err: any) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to connect');
      setIsConnecting(false);
      setIsConnected(false);
    }
  }, [isConnected, isConnecting, instructions]);

  const disconnect = useCallback(async () => {
    dcRef.current?.close();
    pcRef.current?.close();
    if (audioElRef.current) {
      audioElRef.current.srcObject = null;
    }
    setIsConnected(false);
    setIsSpeaking(false);
    clearAll(); // Clear all persisted data in Zustand store
  }, [clearAll]);

  const clearMessages = useCallback(() => {
    clearAll();
  }, [clearAll]);

  return {
    isConnected,
    isConnecting,
    isSpeaking,
    error,
    messages,
    rawEvents,
    audioLevel,
    toolExecutions,
    pendingToolCall,
    approveTool: () => pendingToolCall?.resolve(true),
    rejectTool: () => pendingToolCall?.resolve(false),
    connect,
    disconnect,
    clearMessages,
  };
}
