import { Moment } from '../../types';
import { MomentContextValue } from './hooks/MomentContext';



export type MomentProps = {
  moment: Moment;
  
  Moment?: React.ComponentType<MomentUIComponentProps>;
};

export type MomentUIComponentProps = Partial<MomentContextValue>;