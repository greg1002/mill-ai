
/* Returns the score in [0,1] representing standing for both players
  1 if win, 0 if loss, or some value on (0,1) based on material
*/
export default function score(gs) {
  let score;
  if (gs.winner === "B") score = 1;
  else if (gs.winner === "W") score = 0;
  else {
    let diff = Math.abs(gs.pieces["B"] - gs.pieces["W"]);
    score =
    gs.pieces["B"] > gs.pieces["W"] ? (diff + 1) / (diff + 2) :
    1 / (diff + 2);
  }
  return {"B": score, "W": 1 - score}
}
