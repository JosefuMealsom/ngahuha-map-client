const canvas = document.createElement('canvas');
canvas.width = 1222;
canvas.height = 1857;

drawMap(canvas);

export default canvas;

function drawMap(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return;
  }

  ctx.font = '3px Arial';
  // #layer2
  ctx.save();
  ctx.transform(1.0, 0.0, 0.0, 1.0, 534.834, 812.174);
  ctx.restore();

  // #layer1
  ctx.save();
  ctx.transform(8.0, 0.0, 0.0, 8.0, -0.0, -3.1481);

  // #path2
  ctx.beginPath();
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.lineWidth = 0.14949;
  ctx.lineJoin = 'round';
  ctx.moveTo(5.514646, 78.43319);
  ctx.lineTo(71.00234, 0.575356);
  ctx.lineTo(94.314133, 31.921338);
  ctx.lineTo(117.42471, 13.321876);
  ctx.lineTo(129.63308, 25.239572);
  ctx.lineTo(122.65687, 31.343758);
  ctx.bezierCurveTo(
    125.05273,
    37.037734,
    127.58065,
    42.637381,
    127.30768,
    50.237664,
  );
  ctx.lineTo(129.92376, 55.7605);
  ctx.lineTo(125.56363, 59.539282);
  ctx.bezierCurveTo(
    132.48813,
    91.68854,
    152.0924,
    125.36796,
    142.65574,
    156.12478,
  );
  ctx.lineTo(152.5387, 163.97302);
  ctx.bezierCurveTo(
    137.98859,
    188.13469,
    123.81039,
    210.90906,
    109.26028,
    231.96728,
  );
  ctx.lineTo(61.596169, 206.62863);
  ctx.lineTo(69.172582, 195.28474);
  ctx.lineTo(29.350037, 173.77475);
  ctx.lineTo(57.54556, 126.976);
  ctx.lineTo(0.282487, 84.53737);
  ctx.closePath();
  ctx.stroke();

  // #path3
  ctx.beginPath();
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.lineWidth = 0.149489;
  ctx.lineJoin = 'round';
  ctx.moveTo(127.27211, 49.206765);
  ctx.lineTo(113.63885, 58.160464);
  ctx.lineTo(93.804013, 31.650437);
  ctx.stroke();

  // #path4
  ctx.beginPath();
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.lineWidth = 0.149489;
  ctx.lineJoin = 'round';
  ctx.moveTo(94.082353, 32.171047);
  ctx.lineTo(73.206295, 43.093613);
  ctx.lineTo(53.180732, 49.387362);
  ctx.lineTo(36.588124, 41.758576);
  ctx.stroke();

  // #path5
  ctx.beginPath();
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.lineWidth = 0.149489;
  ctx.lineJoin = 'round';
  ctx.moveTo(104.48431, 76.27883);
  ctx.lineTo(90.561783, 81.8097);
  ctx.lineTo(89.417463, 91.34568);
  ctx.lineTo(104.48431, 94.01575);
  ctx.lineTo(109.82446, 77.99531);
  ctx.closePath();
  ctx.stroke();

  // #path6
  ctx.beginPath();
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.lineWidth = 0.149489;
  ctx.lineJoin = 'round';
  ctx.moveTo(109.63374, 77.42315);
  ctx.lineTo(130.04074, 77.80459);
  ctx.lineTo(137.09737, 97.44871);
  ctx.lineTo(143.58184, 119.95363);
  ctx.lineTo(114.78317, 121.28866);
  ctx.lineTo(101.24208, 102.59814);
  ctx.closePath();
  ctx.stroke();

  // #path7
  ctx.beginPath();
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.lineWidth = 0.149489;
  ctx.lineJoin = 'round';
  ctx.moveTo(114.59245, 121.47938);
  ctx.lineTo(129.85002, 143.9843);
  ctx.lineTo(144.91687, 145.31934);
  ctx.stroke();

  // #path8
  ctx.beginPath();
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.lineWidth = 0.149489;
  ctx.lineJoin = 'round';
  ctx.moveTo(100.4792, 102.2167);
  ctx.lineTo(76.257809, 115.18564);
  ctx.lineTo(104.48431, 129.29889);
  ctx.lineTo(114.40173, 121.28866);
  ctx.stroke();

  // #path9
  ctx.beginPath();
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.lineWidth = 0.149489;
  ctx.lineJoin = 'round';
  ctx.moveTo(69.58262, 122.24226);
  ctx.lineTo(108.2987, 144.55646);
  ctx.lineTo(81.597953, 186.51478);
  ctx.lineTo(43.072593, 163.24698);
  ctx.closePath();
  ctx.stroke();

  // #path10
  ctx.beginPath();
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.lineWidth = 0.149489;
  ctx.lineJoin = 'round';
  ctx.moveTo(98.572003, 159.62331);
  ctx.lineTo(140.72104, 184.60758);
  ctx.lineTo(148.92198, 170.68505);
  ctx.lineTo(107.91727, 144.36574);
  ctx.closePath();
  ctx.stroke();

  // #path11
  ctx.beginPath();
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.lineWidth = 0.149489;
  ctx.lineJoin = 'round';
  ctx.moveTo(61.190958, 205.77746);
  ctx.lineTo(69.010461, 195.4786);
  ctx.lineTo(81.407243, 186.7055);
  ctx.lineTo(98.190563, 159.24187);
  ctx.lineTo(140.3396, 184.41686);
  ctx.lineTo(109.2523, 232.28749);
  ctx.closePath();
  ctx.stroke();

  // #path12
  ctx.beginPath();
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.lineWidth = 0.149489;
  ctx.lineJoin = 'round';
  ctx.moveTo(48.412742, 69.031484);
  ctx.lineTo(34.299489, 85.24265);
  ctx.lineTo(51.082816, 94.58791);
  ctx.lineTo(66.149667, 90.77352);
  ctx.closePath();
  ctx.stroke();

  // #text13
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.lineWidth = 0.070115;
  ctx.lineJoin = 'round';
  ctx.font = '3.175px';
  ctx.fillText('Avocadoes', 67.053772, 154.99753);

  // #text14
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.lineWidth = 0.070115;
  ctx.lineJoin = 'round';
  ctx.font = '3.175px';
  ctx.fillText('Privet patch', 114.20878, 164.32487);
  ctx.fillText('None', 114.20878, 168.29362);

  // #text16
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.lineWidth = 0.070115;
  ctx.lineJoin = 'round';
  ctx.font = '3.175px';
  ctx.fillText('Ampitheater', 113.94968, 99.292435);

  // #text17
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.lineWidth = 0.070115;
  ctx.lineJoin = 'round';
  ctx.font = '3.175px';
  ctx.fillText('The wetlands', 123.79523, 130.90182);

  // #text18
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.lineWidth = 0.070115;
  ctx.lineJoin = 'round';
  ctx.font = '3.175px';
  ctx.fillText('Secret garden', 86.744865, 115.87442);

  // #text19
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.lineWidth = 0.070115;
  ctx.lineJoin = 'round';
  ctx.font = '3.175px';
  ctx.fillText('Lotus pond', 90.631271, 85.301392);

  // #text20
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.lineWidth = 0.070115;
  ctx.lineJoin = 'round';
  ctx.font = '3.175px';
  ctx.fillText('Black walnut ', 100.99501, 34.000877);
  ctx.fillText('plantation', 100.99501, 37.969627);

  // #text21
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.lineWidth = 0.070115;
  ctx.lineJoin = 'round';
  ctx.font = '3.175px';
  ctx.fillText('Lakeview path', 59.008919, 28.67034);

  // #text22
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.lineWidth = 0.070115;
  ctx.lineJoin = 'round';
  ctx.font = '3.175px';
  ctx.fillText('Handsome boy', 37.25803, 83.228645);
  ctx.fillText('habitat', 37.25803, 87.197395);

  // #text25
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.lineWidth = 0.070114;
  ctx.lineJoin = 'round';
  ctx.font = '3.175px';
  ctx.fillText('The Steppes', 95.035866, 194.63884);
  ctx.restore();
}
