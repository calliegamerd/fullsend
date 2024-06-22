import React, { Component } from "react";
import PropTypes from "prop-types";

const NumberTicker = ({ style, textSize = 35, textStyle, number, duration }) => {
  const mapToDigits = () => {
    return (number + '').split('').map((data) => {
      if (data === '.' || data === ',') {
        return (
          <span key={data} style={{ ...textStyle, fontSize: textSize }}>{data}</span>
        );
      }
      return (
        <TextTicker
          key={data}
          textSize={textSize}
          textStyle={textStyle}
          targetNumber={parseFloat(data, 10)}
          duration={duration}
        />
      );
    });
  };

  return (
    <div style={style}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {mapToDigits()}
      </div>
    </div>
  );
};

class TextTicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAnimating: true,
      delay: 800,
      number: 1,
    };

    this.numberList = [];
    const { targetNumber } = this.props;

    if (targetNumber > 5) {
      for (let i = 0; i <= targetNumber; i++) {
        this.numberList.push({ id: i });
      }
    } else {
      for (let i = 9; i >= targetNumber; i--) {
        this.numberList.push({ id: i });
      }
    }
  }

  componentDidMount() {
    this.startAnimation();
  }

  numberList = [];

  startAnimation = () => {
    // You can implement animations using CSS transitions or libraries like react-spring in a React app.
  };

  getInterpolatedVal = () => {
    // You can implement interpolation logic using CSS properties in a React app.
  };

  renderNumbers = (styles) => {
    return this.numberList.map((data) => {
      return (
        <span key={data.id} style={{ ...this.props.textStyle, ...styles.text }}>
          {data.id}
        </span>
      );
    });
  };

  render() {
    const styles = generateStyles(this.props.textSize);

    return (
      <div style={styles.container}>
        <div style={{ transform: `translateY(${this.getInterpolatedVal()})` }}>
          {this.renderNumbers(styles)}
        </div>
      </div>
    );
  }
}

TextTicker.defaultProps = {
  duration: 1800,
  targetNumber: 7,
  movingDown: true,
  textSize: 35,
};

TextTicker.propTypes = {
  duration: PropTypes.number,
  targetNumber: PropTypes.number,
  movingDown: PropTypes.bool,
  textSize: PropTypes.number,
  textStyle: PropTypes.object,
};

const generateStyles = (textSize) => {
  return {
    container: {
      width: `${textSize * 0.62}px`,
      height: `${textSize}px`,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    text: {
      fontSize: `${textSize}px`,
      lineHeight: `${textSize}px`,
    },
  };
};

export default NumberTicker;
