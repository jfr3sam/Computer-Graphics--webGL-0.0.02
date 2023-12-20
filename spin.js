var canvas
var gl

var NumVertices = 24

var points = []
var colors = []

var xAxis = 0
var yAxis = 1
var zAxis = 2

var axis = 0
var theta = [0, 0, 0]

var thetaLoc

var flag = true
function x() {
  axis = xAxis
}
function y() {
  axis = yAxis
}
function z() {
  axis = zAxis
}

window.onload = function init() {
  canvas = document.getElementById('gl-canvas')

  gl = WebGLUtils.setupWebGL(canvas)
  if (!gl) {
    alert("WebGL isn't available")
  }

  colorCube()

  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(1.0, 1.0, 1.0, 1.0)

  gl.enable(gl.DEPTH_TEST)

  //
  //  Load shaders and initialize attribute buffers
  //
  var program = initShaders(gl, 'vertex-shader', 'fragment-shader')
  gl.useProgram(program)

  var cBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW)

  var vColor = gl.getAttribLocation(program, 'vColor')
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(vColor)

  var vBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW)

  var vPosition = gl.getAttribLocation(program, 'vPosition')
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(vPosition)

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

function colorCube() {
  quad(1, 0, 3, 2)
  quad(3, 0, 4, 7)
  quad(6, 5, 1, 2)
  quad(4, 5, 6, 7)
}

function quad(a, b, c, d) {
  var vertices = [
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, 0.5, 0.5, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(0.5, 0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0),
  ]

  var vertexColors = [
    [1.0, 0.0, 0.0, 1.0], // red
    [1.0, 0.0, 0.0, 1.0], // red
    [1.0, 0.0, 0.0, 1.0], // red
    [0.0, 0.0, 1.0, 1.0], // blue
    [1.0, 0.0, 0.0, 1.0], // red
    [1.0, 0.0, 0.0, 1.0], // red
    [0.0, 0.0, 1.0, 1.0], // blue
    [1.0, 0.0, 0.0, 1.0], // red
  ]

  //vertex color assigned by the index of the vertex

  var indices = [a, b, c, a, c, d]

  for (var i = 0; i < indices.length; ++i) {
    points.push(vertices[indices[i]])
    //colors.push( vertexColors[indices[i]] );

    // for solid colored faces use
    colors.push(vertexColors[a])
  }
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  if (flag) theta[axis] += 2.0
  gl.uniform3fv(thetaLoc, theta)
  gl.drawArrays(gl.TRIANGLES, 0, NumVertices)
  requestAnimFrame(render)
}
