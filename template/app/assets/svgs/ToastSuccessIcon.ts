/**
 *
 */
export const SvgToastSuccessIconTemplate = (): string => {
  return `
    // Auto-generated file created by svgr-cli source SvgTemplate.ts
    // Run yarn icons:create to update
    // Do not edit

    import * as React from 'react';
    import Svg, { Path } from 'react-native-svg';
    import type { SvgProps } from 'react-native-svg';

    /**
     * The SvgToastSuccessIcon SVG component
     * @param props SvgProps which will change runtime
     * @returns react native component
     */
    const SvgToastSuccessIcon = (props: SvgProps): React.ReactElement => (
      <Svg fill="none" viewBox="0 0 20 20" {...props}>
        <Path
          fill={props.color}
          fillRule="evenodd"
          d="M10 19.6A9.6 9.6 0 1 0 10 .4a9.6 9.6 0 0 0 0 19.2m4.628-11.77a.9.9 0 0 0-1.456-1.06l-4.18 5.749-2.256-2.255a.9.9 0 0 0-1.272 1.272l3 3a.9.9 0 0 0 1.364-.107z"
          clipRule="evenodd"
        />
      </Svg>
    );

    export default SvgToastSuccessIcon;
  `;
};
