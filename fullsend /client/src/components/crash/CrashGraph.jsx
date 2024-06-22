import { makeStyles, withStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const useStyles = makeStyles({
  root: {
    height: "25rem"
  }
});

// Same game states as in backend
const GAME_STATES = {
  NotStarted: 1,
  Starting: 2,
  InProgress: 3,
  Over: 4,
  Blocking: 5,
  Refunded: 6,
};

const BET_STATES = {
  Playing: 1,
  CashedOut: 2,
};

const CrashGraph = ({ data }) => {
  const classes = useStyles();

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Crash Game',
        fill: false,
        lineTension: 0.1,
        animation: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 0, // Set to 0 to remove the dots
        pointHitRadius: 0,
        data: [],
      },
    ],
  });

  useEffect(() => {
    setChartData((prevData) => ({
      ...prevData,
      labels: data.map((_, index) => index + 1),
      datasets: [
        {
          ...prevData.datasets[0],
          data: data,
        },
      ],
    }));
  }, [data]);

  return (
    <div className={classes.root}>
      <Line
       style={{
        height: "100%",
        width: "100%"
       }}
       data={chartData} 
       options={{
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            display: false,
          },
          y: {
            display: true,
          },
        },
       }} />
    </div>
  );
};

export default CrashGraph;

/*import { createEffect } from "solid-js";

const Graph = (props) => {
  let graphRef;
  let canvasRef;

  const getTime = (mult) => Math.log(mult) / 0.00006;

  const screenSizeChange = () => {
    const ctx = graphRef?.getContext("2d");
    const multi = props?.payout;
    const timeElapsed = getTime(multi);
    const values = getValues(timeElapsed, multi);

    resizeCanvas();
    clearGraph(ctx);
    drawAxes(ctx, multi, values);
    drawGraph(ctx, multi, values);
  };

  const resizeCanvas = () => {
    const ctx = graphRef?.getContext("2d");

    if (ctx) {
      graphRef.height = canvasRef.clientHeight;
      graphRef.width = canvasRef.clientWidth;
    }
  };

  createEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", screenSizeChange);
    return () => window.removeEventListener("resize", screenSizeChange);
  });

  createEffect(() => {
    const ctx = graphRef?.getContext("2d");

    if (!ctx || !props?.payout) return;

    const multi = props.payout;
    const timeElapsed = getTime(multi);
    const values = getValues(timeElapsed, multi);

    clearGraph(ctx);
    drawAxes(ctx, multi, values);
    drawGraph(ctx, multi, values);
  });

  const getValues = (time, multi) => {
    const yAxisMin = 2;
    let xStart = 20;
    let yStart = 20;
    let xEnd = 80;
    let yEnd = 80;
    let yAxisValue = 2;
    let xAxisValue = 10000; // 10 seconds
    const canvasHeight = canvasRef.clientHeight;
    const canvasWidth = canvasRef.clientWidth;
    const plotHeight = canvasHeight - yStart;
    const plotWidth = canvasWidth - xStart;

    if (time > xAxisValue) xAxisValue = time;

    if (multi > yAxisValue) yAxisValue = multi;

    yAxisValue -= 1;
    const widthIncrement = canvasWidth / xAxisValue;
    const heightIncrement = canvasHeight / yAxisValue;
    const currentX = time * widthIncrement;

    return {
      xEnd,
      yEnd,
      xStart,
      yStart,
      canvasHeight,
      canvasWidth,
      yAxisValue,
      xAxisValue,
      plotHeight,
      plotWidth,
      widthIncrement,
      heightIncrement,
      currentX,
    };
  };

  function drawGraph(ctx, multi, values) {
    ctx.strokeStyle = '#ff9900';
    ctx.lineWidth = 3;
    ctx.beginPath();
  
    for (let t = 0; t <= values.xAxisValue; t += 0.01) {
      let m = Math.exp(0.00006 * t);
      let adjustedM = m - 1;
  
      let y = values.canvasHeight - (adjustedM * values.heightIncrement) - values.yStart;
      let x = t * values.widthIncrement;
      ctx.lineTo(x, y);
    }
  
    ctx.stroke();
  }
  
  const drawAxes = (ctx, multi, values) => {
    const stepValues = (x) => {
      let c = 0.4;
      let r = 0.1;
      while (true) {
        if (x < c) return r;

        c *= 5;
        r *= 2;

        if (x < c) return r;
        c *= 2;
        r *= 5;
      }
    };

    const payoutSeparation = stepValues(multi);

    ctx.lineWidth = 1;
    ctx.strokeStyle = "white";
    ctx.font = "normal normal bold 13px Geogrotesque Wide";
    ctx.fillStyle = "white";

    for (let payout = payoutSeparation, i = 0; payout < values.yAxisValue; payout += payoutSeparation, i++) {
      const y = values.plotHeight - payout * values.heightIncrement;
      const text = (payout + 1).toFixed(2) + "x";
      const textWidth = ctx.measureText(text).width;

      ctx.fillText(text, values.plotWidth - textWidth, y - 5);

      ctx.beginPath();
      ctx.moveTo(values.plotWidth, y);
      ctx.setLineDash([20, 10]);
      ctx.lineTo(20, y);
      ctx.strokeStyle = "#291114";
      ctx.stroke();

      if (i > 100) break;
    }

    // Calculate X Axis
    const milisecondsSeparation = stepValues(values.xAxisValue);
    const XAxisValuesSeparation = values.plotWidth / (values.xAxisValue / milisecondsSeparation);

    // Draw X Axis Values
    for (let miliseconds = 0, counter = 0, i = 0; miliseconds < values.xAxisValue; miliseconds += milisecondsSeparation, counter++, i++) {
      const seconds = miliseconds / 1000;
      const textWidth = ctx.measureText(seconds).width;
      const x = counter * XAxisValuesSeparation + values.xStart;
      ctx.fillText(seconds + "s", x - textWidth / 2, values.plotHeight + 11);

      if (i > 100) break;
    }

    // Draw background Axis
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, values.canvasHeight);
    ctx.lineTo(0, values.canvasHeight);
    ctx.stroke();
  };

  const clearGraph = (ctx) => {
    ctx.clearRect(0, 0, graphRef?.width, graphRef?.height);
  };

  return (
    <>
      <div ref={canvasRef} class="canvas">
        <canvas ref={(ref) => (graphRef = ref)}></canvas>
      </div>

      <style jsx>{`
        .canvas {
          top: 0;
          left: 0;
          z-index: 1;
          position: absolute;
          display: flex;
          height: 100%;
          width: 100%;
        }
      `}</style>
    </>
  );
};

export default Graph;
*/