/**
 *
 */
export const SvgCloseWithCircleIconTemplate = (): string => {
  return `
    // Auto-generated file created by svgr-cli source SvgTemplate.ts
    // Run yarn icons:create to update
    // Do not edit

    import * as React from 'react';
    import Svg, { Path } from 'react-native-svg';
    import type { SvgProps } from 'react-native-svg';

    /**
     * The SvgCloseWithCircleIcon SVG component
     * @param props SvgProps which will change runtime
     * @returns react native component
     */
    const SvgCloseWithCircleIcon = (props: SvgProps): React.ReactElement => (
      <Svg fill="none" viewBox="0 0 20 20" {...props}>
        <Path
          stroke={props.color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M10 18.333c4.583 0 8.333-3.75 8.333-8.333S14.583 1.667 10 1.667 1.667 5.417 1.667 10s3.75 8.333 8.333 8.333M7.642 12.358l4.716-4.716M12.358 12.358 7.642 7.642"
        />
      </Svg>
    );

    export default SvgCloseWithCircleIcon;
  `;
};
