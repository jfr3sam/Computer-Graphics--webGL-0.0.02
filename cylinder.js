const points = [],
  colors = [],
  xAxis = 0,
  yAxis = 1,
  zAxis = 2,
  theta = [0, 0, 0]
let canvas,
  gl,
  axis = 0,
  thetaLoc,
  flag = true

function x() {
  axis = xAxis
}
function y() {
  axis = yAxis
}
function z() {
  axis = zAxis
}

const vertices = [
  vec4(0.5, -0.5, -0.5, 1.0),
  vec4(0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.5, -0.5, 1.0),
  vec4(-0.5, 0.5, 0.5, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(0.5, 0.5, -0.5, 1.0),
  vec4(-0.5, 0.5, -0.5, 1.0),
]

const vertexColors = [
  [1.0, 0.0, 0.0, 1.0], // red
  [0.0, 0.0, 1.0, 1.0], // blue
]

window.onload = () => {
  canvas = document.getElementById('gl-canvas')

  gl = WebGLUtils.setupWebGL(canvas)
  if (!gl) alert("WebGL isn't available")

  for (let v of vertices) normalize(v)
  divide_quad(vertices[6], vertices[5], vertices[1], vertices[0], 3)
  divide_quad(vertices[5], vertices[4], vertices[2], vertices[1], 3)
  divide_quad(vertices[4], vertices[7], vertices[3], vertices[2], 3)
  divide_quad(vertices[7], vertices[6], vertices[0], vertices[3], 3)

  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(1.0, 1.0, 1.0, 1.0)

  gl.enable(gl.DEPTH_TEST)

  const program = initShaders(gl, 'vertex-shader', 'fragment-shader')
  gl.useProgram(program)

  const cBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW)

  const vColor = gl.getAttribLocation(program, 'vColor')
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(vColor)

  const vBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW)

  const vPosition = gl.getAttribLocation(program, 'vPosition')
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(vPosition)

  thetaLoc = gl.getUniformLocation(program, 'theta')

  thetaLoc = gl.getUniformLocation(program, 'theta')
  document.getElementById('xButton').onclick = x
  document.getElementById('yButton').onclick = y
  document.getElementById('zButton').onclick = z
  document.getElementById('ButtonT').onclick = function () {
    flag = !flag
  }

  //event listeners for buttons
  document.addEventListener('keydown', function (event) {
    if (event.key === 'F' || event.key === 'f') {
      x()
    }
    if (event.key === 'J' || event.key === 'j') {
      y()
    }
    if (event.key === 'K' || event.key === 'k') {
      z()
    }
  })

  render()
}

function quad(a, b, c, d, e) {
  for (let v of [a, b, c, a, c, d]) {
    points.push(v)
    colors.push(vertexColors[e])
  }
}

function divide_quad(v1, v2, v3, v4, count, e = 0) {
  if (count === 0) {
    // Render the current quadrilateral
    quad(v1, v2, v3, v4, e)
  } else {
    // Calculate new vertices at the center of top and bottom edges
    const mid1 = [
      (v1[0] + v2[0]) / 2,
      (v1[1] + v2[1]) / 2,
      (v1[2] + v2[2]) / 2,
      1,
    ]
    const mid2 = [
      (v3[0] + v4[0]) / 2,
      (v3[1] + v4[1]) / 2,
      (v3[2] + v4[2]) / 2,
      1,
    ]
    // Normalize the new vertices
    normalize(mid1)
    normalize(mid2)
    // Recursive calls for the newly created quads
    divide_quad(v1, mid1, mid2, v4, count - 1, 0)
    divide_quad(mid1, v2, v3, mid2, count - 1, 1)
  }
}

function normalize(vertex) {
  const len = Math.sqrt(vertex[0] * vertex[0] + vertex[2] * vertex[2])
  vertex[0] *= 0.5 / len
  vertex[2] *= 0.5 / len
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  if (flag) theta[axis] += 2.0
  gl.uniform3fv(thetaLoc, theta)
  gl.drawArrays(gl.TRIANGLES, 0, points.length)
  requestAnimFrame(render)
}
