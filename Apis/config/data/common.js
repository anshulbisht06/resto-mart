exports.appendToShortHand = function(shortHands){
  let keys = Object.keys(shortHands), tmp, tmp1;
  for(let i = 0; i < keys.length; i++){
    tmp = Object.keys(shortHands[keys[i]].r);
    for(let j = 0; j < tmp.length; j++){
      shortHands[keys[i]].r1[tmp[j]]= {}
      tmp1 = Object.keys(shortHands[keys[i]].r[tmp[j]]);
      for(let k = 0; k < tmp1.length; k++){
        // console.log(tmp1[k], shortHands[keys[i]].r[tmp[j]])
        shortHands[keys[i]].r1[tmp[j]][shortHands[keys[i]].r[tmp[j]][tmp1[k]]] = tmp1[k];
      }
    }
  }
  return shortHands
}
