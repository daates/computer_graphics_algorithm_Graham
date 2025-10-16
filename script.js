const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const draw_button = document.getElementById("draw_point");
const run_button = document.getElementById("run_algorithm");
const clean_button = document.getElementById("clean_canvas");

let isActiveButtonDraw = false;

let points = [];

function draw(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fillStyle = "black";
  ctx.fill();

  points.push([x, y]);
}

function buttonEnter(event) {
  if (event.key === "Enter") {
    draw_button.click();
  }
}

function handleClickDrawButton() {
  isActiveButtonDraw = !isActiveButtonDraw;

  if (isActiveButtonDraw) {
    draw_button.classList.add("active");
    canvas.addEventListener("click", draw);
    document.addEventListener("keydown", buttonEnter);
  } else {
    draw_button.classList.remove("active");
    canvas.removeEventListener("click", draw);
    document.removeEventListener("keydown", buttonEnter);
  }
}

function cleanCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  points = [];
  draw_button.classList.remove("active");
  canvas.removeEventListener("click", draw);
  isActiveButtonDraw = false;
}

function runGraham() {
  if (points.length < 3) return points;

  const start = points.reduce((lowest, p) =>
    p[1] < lowest[1] || (p[1] === lowest[1] && p[0] < lowest[0]) ? p : lowest
  );

  const sorted = points
    .filter((p) => p !== start)
    .sort((a, b) => {
      const angleA = Math.atan2(a[1] - start[1], a[0] - start[0]);
      const angleB = Math.atan2(b[1] - start[1], b[0] - start[0]);
      return angleA - angleB;
    });

  function cross(o, a, b) {
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  }

  const hull = [start];
  for (const p of sorted) {
    while (
      hull.length >= 2 &&
      cross(hull[hull.length - 2], hull[hull.length - 1], p) <= 0
    ) {
      hull.pop();
    }
    hull.push(p);
  }

  ctx.beginPath();
  ctx.moveTo(hull[0][0], hull[0][1]);
  for (let i = 1; i < hull.length; i++) {
    ctx.lineTo(hull[i][0], hull[i][1]);
  }
  ctx.closePath();
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.stroke();
}

draw_button.addEventListener("click", handleClickDrawButton);
clean_button.addEventListener("click", cleanCanvas);
run_button.addEventListener("click", runGraham);
