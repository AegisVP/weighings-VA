export const theme = {
  colors: {
    text: {
      defaultText: '#090909',
      mediumText: '#555555',
      inverseText: 'd9d9d9',
      errorText: '#d95555',
    },
    background: {
      pageBackground: '#fefefe',
      secondBackground: '#ffffee',
    },
  },
  fontSizes: {
    xs: '8px',
    s: '12px',
    m: '16px',
    l: '24px',
    xl: '36px',
    xxl: '48px',
  },
  fontWeights: {
    thin: 100,
    normal: 400,
    bold: 700,
  },
  spacing: [0, 5, 10, 20, 40, 80, 160, 320, 640],
  radii: {
    none: 0,
    normal: '5px',
    large: '10px',
    round: '50%',
  },
  shadow: {
    button: {
      default: '0 0 3px 2px rgba(0, 0, 0, 0.1)',
      hover: 'inset -2px -2px 3px 1px rgba(0, 0, 0, 0.1)',
      active: 'inset 2px 2px 3px 1px rgba(0, 0, 0, 0.3)',
    },
  },
  margin: `margin: ${returnParams}`,
  padding: `padding: ${returnParams}`,
  mp: returnParams,
};

function returnParams(...sizes) {
  if (sizes.length === 0) return;

  const resultArray = [];

  for (const size of sizes) {
    let index = size;

    if (index === 0) {
      resultArray.push('0');
    } else if (index > 0) {
      if (index >= this.spacing.length) index = this.spacing.length;
      resultArray.push(`${this.spacing[index]}px`);
    } else if (index < 0) {
      index = index * -1;
      if (index >= this.spacing.length) index = this.spacing.length;
      resultArray.push(`-${this.spacing[index]}px`);
    } else if (index === 'auto') {
      resultArray.push('auto');
    }
  }

  return resultArray.join(' ');
}
