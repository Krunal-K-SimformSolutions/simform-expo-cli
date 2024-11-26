/**
 *
 */
export const SvgToastWarningIconTemplate = (): string => {
  return `
    // Auto-generated file created by svgr-cli source SvgTemplate.ts
    // Run yarn icons:create to update
    // Do not edit

    import * as React from 'react';
    import Svg, { Path } from 'react-native-svg';
    import type { SvgProps } from 'react-native-svg';

    /**
     * The SvgToastWarningIcon SVG component
     * @param props SvgProps which will change runtime
     * @returns react native component
     */
    const SvgToastWarningIcon = (props: SvgProps): React.ReactElement => (
      <Svg fill="none" viewBox="0 0 20 20" {...props}>
        <Path
          fill={props.color}
          d="M10 20c5.51 0 10-4.49 10-10S15.51 0 10 0 0 4.49 0 10s4.49 10 10 10m.75-6c0 .41-.34.75-.75.75s-.75-.34-.75-.75V9c0-.41.34-.75.75-.75s.75.34.75.75zM9.08 5.62c.05-.13.12-.23.21-.33q.15-.135.33-.21c.12-.05.25-.08.38-.08s.26.03.38.08q.18.075.33.21c.09.1.16.2.21.33.05.12.08.25.08.38s-.03.26-.08.38q-.075.18-.21.33-.15.135-.33.21a1 1 0 0 1-.76 0q-.18-.075-.33-.21-.135-.15-.21-.33A1 1 0 0 1 9 6c0-.13.03-.26.08-.38"
        />
      </Svg>
    );

    export default SvgToastWarningIcon;
  `;
};
