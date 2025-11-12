/**
 * Widget Primitives Index
 *
 * Exports all primitive components and registers them in the registry.
 */

import { registerWidget } from '../registry';

// Layout primitives
import { Frame } from './Frame';
import { FrameHeader } from './FrameHeader';
import { Row } from './Row';
import { Col } from './Col';
import { Spacer } from './Spacer';
import { Divider } from './Divider';

// Content primitives
import { Text } from './Text';
import { Icon } from './Icon';
import { Avatar } from './Avatar';
import { Amount } from './Amount';
import { Time } from './Time';
import { Badge } from './Badge';

// Interactive primitives
import { Button } from './Button';

// Pattern components
import { KeyValueRow } from './KeyValueRow';
import { KeyValueList } from './KeyValueList';
import { ButtonGroup } from './ButtonGroup';

// Register all primitives
registerWidget('Frame', Frame as any);
registerWidget('FrameHeader', FrameHeader as any);
registerWidget('Row', Row as any);
registerWidget('Col', Col as any);
registerWidget('Spacer', Spacer as any);
registerWidget('Divider', Divider as any);
registerWidget('Text', Text as any);
registerWidget('Icon', Icon as any);
registerWidget('Avatar', Avatar as any);
registerWidget('Amount', Amount as any);
registerWidget('Time', Time as any);
registerWidget('Badge', Badge as any);
registerWidget('Button', Button as any);
registerWidget('KeyValueRow', KeyValueRow as any);
registerWidget('KeyValueList', KeyValueList as any);
registerWidget('ButtonGroup', ButtonGroup as any);

// Export all primitives
export {
  Frame,
  FrameHeader,
  Row,
  Col,
  Spacer,
  Divider,
  Text,
  Icon,
  Avatar,
  Amount,
  Time,
  Badge,
  Button,
  KeyValueRow,
  KeyValueList,
  ButtonGroup,
};
