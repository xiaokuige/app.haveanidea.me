import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Idea = {
  index: number;
  name: string;
  title: string;
  story: string;
  goal: number;
  endTime: number;
  initiator: string;
  img: string;
  over: boolean;
  success: boolean;
  amount: number;
  numFunders: number;
  numUses: number;
  myAmount?: number;
}