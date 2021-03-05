const CARDINAL_DIRECTION = {
    EAST: 1,
    NORTH: 2,
    WEST: 3,
    SOUTH: 4
  };

function generateInstructionsFor(iterations) {
  const instructions = ['F'];

  function genInstructionsRec(instructions, iterations) {
    if(iterations === 0) {
      return instructions;
    }

    // generating mappings F -> FLG, G -> FRG
    const updatedInstructions = instructions.flatMap(i => {
      if(i === 'F') {
        return ['F', 'L', 'G'];
      } else if (i === 'G') {
        return ['F', 'R', 'G'];
      }
      return [i];
    });
    return genInstructionsRec(updatedInstructions, iterations - 1);
  }

  return genInstructionsRec(instructions, iterations);
}



function generateCoordinatesFrom(instructions, startX, startY, unit, cd) {
  const coordinates = [];

  // init starting coordinates
  coordinates.push(`${startX},${startY}`);

  let current_dir = cd;
  let currentX = startX;
  let currentY = startY;
  instructions.forEach(instruction => {
    let coordinate;

    switch(instruction) {
      case 'F':
      case 'G':
        if(current_dir === CARDINAL_DIRECTION.EAST) {
          currentX = currentX + unit;
          currentY = currentY;
        } else if(current_dir === CARDINAL_DIRECTION.NORTH) {
          currentX = currentX;
          currentY = currentY - unit;
        } else if(current_dir === CARDINAL_DIRECTION.WEST) {
          currentX = currentX - unit;
          currentY = currentY;
        } else if(current_dir === CARDINAL_DIRECTION.SOUTH) {
          currentX = currentX;
          currentY = currentY + unit;
        } else {
          throw new Error('Unparseable cardinal direction: ' + current_dir);
        }

        coordinate = `${currentX},${currentY}`;
        coordinates.push(coordinate);
        break;
      case 'L':
        if(current_dir === CARDINAL_DIRECTION.EAST) {
          currentX = currentX;
          currentY = currentY - unit;

          current_dir = CARDINAL_DIRECTION.NORTH;
        } else if(current_dir === CARDINAL_DIRECTION.NORTH) {
          currentX = currentX - unit;
          currentY = currentY;

          current_dir = CARDINAL_DIRECTION.WEST;
        } else if(current_dir === CARDINAL_DIRECTION.WEST) {
          currentX = currentX;
          currentY = currentY + unit;

          current_dir = CARDINAL_DIRECTION.SOUTH;
        } else if(current_dir === CARDINAL_DIRECTION.SOUTH) {
          currentX = currentX + unit;
          currentY = currentY;

          current_dir = CARDINAL_DIRECTION.EAST;
        } else {
          throw new Error('Unparseable cardinal direction: ' + current_dir);
        }

        coordinate = `${currentX},${currentY}`;
        coordinates.push(coordinate);
        break;
      case 'R':
        if(current_dir === CARDINAL_DIRECTION.EAST) {
          currentX = currentX;
          currentY = currentY + unit;

          current_dir = CARDINAL_DIRECTION.SOUTH;
        } else if(current_dir === CARDINAL_DIRECTION.NORTH) {
          currentX = currentX + unit;
          currentY = currentY;

          current_dir = CARDINAL_DIRECTION.EAST;
        } else if(current_dir === CARDINAL_DIRECTION.WEST) {
          currentX = currentX;
          currentY = currentY - unit;

          current_dir = CARDINAL_DIRECTION.NORTH;
        } else if(current_dir === CARDINAL_DIRECTION.SOUTH) {
          currentX = currentX - unit;
          currentY = currentY;

          current_dir = CARDINAL_DIRECTION.WEST;
        } else {
          throw new Error('Unparseable cardinal direction: ' + current_dir);
        }

        coordinate = `${currentX},${currentY}`;
        coordinates.push(coordinate);
        break;
      default:
        throw new Error('Unparseable instruction: ' + instruction);
    }

  });

  return coordinates;
}

function getParams() {
  const searchParams = (new URL(document.location)).searchParams;
  const x = searchParams.get('x');
  const y = searchParams.get('y');
  const unit = searchParams.get('unit');
  const steps = searchParams.get('steps');

  return {
    x,
    y,
    unit,
    steps
  };
}

(function() {
  const pl = document.getElementById('pl');
  const {
    x,
    y,
    unit,
    steps
  } = getParams();

  // (0, 0) is the top left corner
  const startX = parseInt(x, 10) || 250;
  const startY = parseInt(y, 10) || 150;

  // How much to move in each step?
  const strokeUnit = parseFloat(unit) || 0.1;

  // What cardinal direction are we facing? East, North, West, South
  let cd = CARDINAL_DIRECTION.EAST;

  // Instructions list with the alphabet: F, G, L, R
  const instructions = generateInstructionsFor(steps || 15);
  // console.log(instructions)

  const coordinates = generateCoordinatesFrom(instructions, startX, startY, strokeUnit, cd);
  // console.log(coordinates)

  pl.setAttribute('points', coordinates.join(' '));
}());