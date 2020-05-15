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
    pieces: 4
  }
}

export default board_layouts;
