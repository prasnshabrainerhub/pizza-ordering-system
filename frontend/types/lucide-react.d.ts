import { SVGProps, ForwardRefExoticComponent, RefAttributes } from 'react';

declare module 'lucide-react' {
  export type IconNode = [elementName: string, attrs: Record<string, string>][];
  export type SVGAttributes = Partial<SVGProps<SVGSVGElement>>;
  
  export interface LucideProps extends SVGAttributes {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
  }
  
  export type Icon = ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>;
}