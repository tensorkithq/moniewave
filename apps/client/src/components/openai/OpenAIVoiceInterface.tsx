import { useState } from "react";
import { Mic, MicOff, X, Search } from "lucide-react";
import { useOpenAIVoiceAgent } from "./useOpenAIVoiceAgent";
import VoiceOrb from "../VoiceOrb";
import ConversationMessage from "../ConversationMessage";
import { WidgetRenderer } from "../widgets/WidgetRenderer";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const OpenAIVoiceInterface = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    isConnected,
    isConnecting,
    isSpeaking,
    error,
    messages,
    rawEvents,
    audioLevel,
    toolExecutions,
    pendingToolCall,
    approveTool,
    rejectTool,
    connect,
    disconnect,
  } = useOpenAIVoiceAgent({
    instructions: "You are a helpful voice assistant. Be concise and friendly.",
    name: "OpenAI Assistant",
  });

  const handleConnect = async () => {
    await connect();
  };

  const handleDisconnect = async () => {
    await disconnect();
  };

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="min-h-screen flex w-full">
        {/* Logs Sidebar - Always Visible */}
        <Sidebar 
          className={`border-r transition-all duration-300 ${sidebarOpen ? 'w-[480px]' : 'w-[12px]'}`}
          collapsible="offcanvas"
        >
          {/* <SidebarHeader className="p-4 border-b">
            <p className="text-xs text-muted-foreground">Raw events and tool executions</p>
          </SidebarHeader> */}
          
          <SidebarContent className="p-0 bg-background">
            <div className="flex flex-col h-full p-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:bg-slate-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-slate-500">
              {/* Raw Events Section - Top Half */}
              <div className="flex-1 border-b flex flex-col">
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="text-xs font-medium text-muted-foreground">raw.events</h3>
                </div>
                <div className="p-4 overflow-y-auto flex-1">
                  {rawEvents.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8 text-sm">
                      No events yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {rawEvents.map((event, index) => (
                        <details key={index} className="text-xs border rounded p-2" open>
                          <summary className="cursor-pointer font-medium mb-1">
                            {event.type || 'Event'} - {new Date().toLocaleTimeString()}
                          </summary>
                          <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                            {JSON.stringify(event, null, 2)}
                          </pre>
                        </details>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Tool Calls Section - Bottom Half */}
              <div className="flex-1 flex flex-col">
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="text-xs font-medium text-muted-foreground">tool.calls</h3>
                </div>
                <div className="p-4 overflow-y-auto flex-1">
                  {toolExecutions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8 text-sm">
                      No tools executed yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {toolExecutions.map((execution) => (
                        <details key={execution.id} className="text-xs border rounded p-2">
                          <summary className="cursor-pointer font-medium mb-1">
                            {execution.toolName} - {new Date(execution.timestamp).toLocaleTimeString()}
                            {execution.duration && (
                              <span className="ml-2 text-primary">({execution.duration}ms)</span>
                            )}
                          </summary>
                          <div className="mt-2 space-y-2">
                            <div>
                              <strong>Arguments:</strong>
                              <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-x-auto">
                                {JSON.stringify(execution.arguments, null, 2)}
                              </pre>
                            </div>
                            <div>
                              <strong>Result:</strong>
                              <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-x-auto">
                                {JSON.stringify(execution.result, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </details>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Main Content Area */}
        <div className="flex-1 h-screen flex flex-col items-center justify-between relative py-8">
      {/* Status Indicator */}
      {isConnected && (
        <div className="absolute top-8 right-8 flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-border">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs text-foreground">Voice Connected</span>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/30">
          <span className="text-xs text-destructive">{error}</span>
        </div>
      )}

      {/* Main Content - Orb */}
      <div className="flex-1 flex flex-col items-center justify-start px-8 mt-12 pt-24">
        <VoiceOrb isActive={isConnected} isSpeaking={isSpeaking} />
      </div>

      {/* Messages Display - Near Bottom */}
      <div className="w-full max-w-xl px-8 items-center mb-12 flex flex-col">
        {messages.length > 0 || toolExecutions.length > 0 ? (
          <div className="space-y-4 w-full ">
            {/* Display recent messages */}
            {messages.slice(-2).map((message, index) => (
              <div key={index} className={index === 0 ? "font-bold" : ""}>
                <ConversationMessage
                  role={message.role}
                  content={message.content}
                />
              </div>
            ))}

            {/* Display widgets from recent tool executions */}
            {toolExecutions.slice(-2).map((execution) => (
              execution.widget && (
                <div key={execution.id} className="mt-4">
                  <WidgetRenderer
                    spec={execution.widget}
                    options={{
                      onAction: (action, ctx) => {
                        console.log('Widget action:', action, ctx);
                        // Handle widget button clicks
                        if (action.type === 'expand') {
                          console.log('Expand widget');
                        }
                      }
                    }}
                  />
                </div>
              )
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground text-sm">
            {isConnected ? "Listening..." : "Connect to start conversation"}
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="pb-24 mb-12 pt-4">
        <div className="flex items-center justify-center gap-6">
          {/* Logs Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
              sidebarOpen
                ? "bg-accent text-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <Search className="w-6 h-6" />
          </button>

          {/* Mic Toggle */}
          <button
            onClick={isConnected ? handleDisconnect : handleConnect}
            disabled={isConnecting}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
              isConnected
                ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                : "bg-foreground hover:bg-foreground/90 text-background"
            } disabled:opacity-50`}
          >
            {isConnected ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* Close/End */}
          {isConnected && (
            <button
              onClick={handleDisconnect}
              className="w-16 h-16 rounded-full bg-muted hover:bg-accent text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
        </div>

      {/* Tool Approval Dialog */}
      {pendingToolCall && (
        <AlertDialog open={!!pendingToolCall}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Approve Tool Execution?</AlertDialogTitle>
              <AlertDialogDescription>
                The assistant wants to execute: <strong>{pendingToolCall.event.name}</strong>
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="my-4">
              <p className="text-sm font-semibold mb-2">Arguments:</p>
              <pre className="text-xs p-3 bg-muted rounded overflow-x-auto max-h-40">
                {JSON.stringify(
                  JSON.parse(pendingToolCall.event.arguments),
                  null,
                  2
                )}
              </pre>
            </div>
            
            <AlertDialogFooter>
              <AlertDialogCancel onClick={rejectTool}>
                Reject
              </AlertDialogCancel>
              <AlertDialogAction onClick={approveTool}>
                Approve
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      </div>
    </SidebarProvider>
  );
};

export default OpenAIVoiceInterface;
