import board_standard from './images/board_standard.png';
import board_small from './images/board_small.png';

const board_layouts = {
  board_standard: {
    init: [
      ["E",null,null,"E",null,null,"E"],
      [null,"E",null,"E",null,"E",null],
      [null,null,"E","E","E",null,null],
      ["E","E","E",null,"E","E","E"],
      [null,null,"E","E","E",null,null],
      [null,"E",null,"E",null,"E",null],
      ["E",null,null,"E",null,null,"E"]
    ],
    adjecencies: [
      {
        0: [{x: 0, y: 3},{x: 3, y: 0}],
        3: [{x: 0, y: 0},{x: 0, y: 6},{x: 1, y: 3}],
        6: [{x: 0, y: 3},{x: 3, y: 6}]
      },{
        1: [{x: 1, y: 3},{x: 3, y: 1}],
        3: [{x: 1, y: 1},{x: 1, y: 5},{x: 0, y: 3},{x: 2, y: 3}],
        5: [{x: 1, y: 3},{x: 3, y: 5}]
      },{
        2: [{x: 2, y: 3},{x: 3, y: 2}],
        3: [{x: 2, y: 2},{x: 2, y: 4},{x: 1, y: 3}],
        4: [{x: 2, y: 3},{x: 3, y: 4}]
      },{
        0: [{x: 0, y: 0},{x: 6, y: 0}, {x: 3, y: 1}],
        1: [{x: 1, y: 1},{x: 5, y: 1}, {x: 3, y: 0}, {x: 3, y: 2}],
        2: [{x: 2, y: 2},{x: 4, y: 2}, {x: 3, y: 1}],
        4: [{x: 4, y: 4},{x: 2, y: 4}, {x: 3, y: 5}],
        5: [{x: 5, y: 5},{x: 1, y: 5}, {x: 3, y: 4}, {x: 3, y: 6}],
        6: [{x: 6, y: 6},{x: 0, y: 6}, {x: 3, y: 5}]
      },{
        2: [{x: 4, y: 3},{x: 3, y: 2}],
        3: [{x: 4, y: 4},{x: 4, y: 2},{x: 5, y: 3}],
        4: [{x: 4, y: 3},{x: 3, y: 4}]
      },{
        1: [{x: 5, y: 3},{x: 3, y: 1}],
        3: [{x: 5, y: 5},{x: 5, y: 1},{x: 6, y: 3},{x: 4, y: 3}],
        5: [{x: 5, y: 3},{x: 3, y: 5}]
      },{
        0: [{x: 6, y: 3},{x: 3, y: 0}],
        3: [{x: 6, y: 6},{x: 6, y: 0},{x: 5, y: 3}],
        6: [{x: 6, y: 3},{x: 3, y: 6}]
      }
    ],
    mills: [
      //vertical mills
      [{x: 0, y: 0},{x: 0, y: 3},{x: 0, y: 6}],
      [{x: 1, y: 1},{x: 1, y: 3},{x: 1, y: 5}],
      [{x: 2, y: 2},{x: 2, y: 3},{x: 2, y: 4}],

      [{x: 3, y: 0},{x: 3, y: 1},{x: 3, y: 2}],
      [{x: 3, y: 4},{x: 3, y: 5},{x: 3, y: 6}],

      [{x: 4, y: 4},{x: 4, y: 3},{x: 4, y: 2}],
      [{x: 5, y: 5},{x: 5, y: 3},{x: 5, y: 1}],
      [{x: 6, y: 6},{x: 6, y: 3},{x: 6, y: 0}],

      //horizontal mills
      [{x: 0, y: 0},{x: 3, y: 0},{x: 6, y: 0}],
      [{x: 1, y: 1},{x: 3, y: 1},{x: 5, y: 1}],
      [{x: 2, y: 2},{x: 3, y: 2},{x: 4, y: 2}],

      [{x: 0, y: 3},{x: 1, y: 3},{x: 2, y: 3}],
      [{x: 4, y: 3},{x: 5, y: 3},{x: 6, y: 3}],

      [{x: 4, y: 4},{x: 3, y: 4},{x: 2, y: 4}],
      [{x: 5, y: 5},{x: 3, y: 5},{x: 1, y: 5}],
      [{x: 6, y: 6},{x: 3, y: 6},{x: 0, y: 6}]
    ],
    pieces: 9,
    image: board_standard,
    x: 7, y: 7
  },
  board_small: {
    init: [
      ["E",null,"E",null,"E"],
      [null,"E","E","E",null],
      ["E","E",null,"E","E"],
      [null,"E","E","E",null],
      ["E",null,"E",null,"E"]
    ],
    adjecencies: [
      {
        0: [{x: 0, y: 2},{x: 2, y: 0}],
        2: [{x: 0, y: 0},{x: 1, y: 2},{x: 0, y: 4}],
        4: [{x: 0, y: 2},{x: 2, y: 4}]
      },{
        1: [{x: 1, y: 2},{x: 2, y: 1}],
        2: [{x: 1, y: 1},{x: 0, y: 2},{x: 1, y: 3}],
        3: [{x: 1, y: 2},{x: 2, y: 3}]
      },{
        0: [{x: 0, y: 0},{x: 2, y: 1},{x: 4, y: 0}],
        1: [{x: 1, y: 1},{x: 2, y: 0},{x: 3, y: 1}],
        3: [{x: 1, y: 3},{x: 2, y: 4},{x: 3, y: 3}],
        4: [{x: 0, y: 4},{x: 2, y: 3},{x: 4, y: 4}],
      },{
        1: [{x: 3, y: 2},{x: 2, y: 3}],
        2: [{x: 3, y: 1},{x: 4, y: 2},{x: 3, y: 3}],
        3: [{x: 3, y: 2},{x: 2, y: 3}]
      },{
        0: [{x: 4, y: 2},{x: 2, y: 0}],
        2: [{x: 4, y: 0},{x: 3, y: 2},{x: 4, y: 4}],
        4: [{x: 4, y: 2},{x: 2, y: 4}]
      }
    ],
    mills: [
      //vertical mills
      [{x: 0, y: 0},{x: 0, y: 2},{x: 0, y: 4}],
      [{x: 1, y: 1},{x: 1, y: 2},{x: 1, y: 3}],

      [{x: 3, y: 3},{x: 3, y: 2},{x: 3, y: 1}],
      [{x: 4, y: 4},{x: 4, y: 2},{x: 4, y: 0}],

      //horizontal mills
      [{x: 0, y: 0},{x: 2, y: 0},{x: 4, y: 0}],
      [{x: 1, y: 1},{x: 2, y: 1},{x: 3, y: 1}],

      [{x: 3, y: 3},{x: 2, y: 3},{x: 1, y: 3}],
      [{x: 4, y: 4},{x: 2, y: 4},{x: 0, y: 4}]
    ],
    pieces: 5,
    image: board_small,
    x: 5, y: 5
  }
}

export default board_layouts;
