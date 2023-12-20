window.onload = function init() {
  var canvas = document.getElementById('gl-canvas')
  var gl = canvas.getContext('webgl2')

  if (!gl) {
    alert("WebGL isn't available")
    return
  }

  // Configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(1.0, 1.0, 1.0, 1.0) // white background

  // Load shaders and initialize attribute buffers
  var program = initShaders(gl, 'vertex-shader', 'fragment-shader')
  gl.useProgram(program)

  // Load the data into the GPU
  var bufferId = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    8 * Float32Array.BYTES_PER_ELEMENT,
    gl.STATIC_DRAW
  )

  // Link shader variables
  var vPosition = gl.getAttribLocation(program, 'vPosition')
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(vPosition)

  // Uniforms
  var uModelViewMatrix = gl.getUniformLocation(program, 'uModelViewMatrix')

  // Define the vertices of the square
  var vertices = [
    vec2(-0.1, -0.1), // Lower left corner
    vec2(0.1, -0.1), // Lower right corner
    vec2(0.1, 0.1), // Upper right corner
    vec2(-0.1, 0.1), // Upper left corner
  ]

  // Load the vertices into the buffer
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices))

  // Create a petal
  function createPetal(angle, scaleFactors) {
    var modelViewMatrix = mat4() // Start with the identity matrix
    modelViewMatrix = mult(modelViewMatrix, translate(0.1, 0.1, 0)) // Move to the origin
    modelViewMatrix = mult(modelViewMatrix, rotate(angle, [0, 0, 1])) // Rotate
    modelViewMatrix = mult(
      modelViewMatrix,
      scalem(scaleFactors.x, scaleFactors.y, 1)
    ) // Scale
    modelViewMatrix = mult(modelViewMatrix, translate(-0.1, -0.1, 0)) // Move back

    return modelViewMatrix
  }

  // Create a diamond inside a square
  function createDiamondInSquare(squareCenter, sideLength) {
    var diamondSideLength = sideLength / Math.sqrt(2) // Calculate diamond side length
    var modelViewMatrix = mat4() // Start with the identity matrix
    modelViewMatrix = mult(
      modelViewMatrix,
      translate(squareCenter[0], squareCenter[1], 0)
    ) // Translate to square center
    modelViewMatrix = mult(modelViewMatrix, rotate(45, [0, 0, 1])) // Rotate to make it a diamond
    modelViewMatrix = mult(
      modelViewMatrix,
      scalem(diamondSideLength, diamondSideLength, 1)
    ) // Scale to fit within the square

    return modelViewMatrix
  }

  // Render function
  function render() {
    gl.clear(gl.COLOR_BUFFER_BIT)
    // Draw the shapes here
    for (var angle = 0; angle < 360; angle += 45) {
      var petalMatrix = createPetal(angle, { x: 1, y: 2 })
      gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(petalMatrix))
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
    }

    // Draw diamonds
    var diamondPositions = [
      /* Positions of diamond centers */
    ]
    diamondPositions.forEach(function (pos) {
      var diamondMatrix = createDiamondInSquare(pos, 0.2)
      gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(diamondMatrix))
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
    })
  }

  // Call render function
  render()
}
