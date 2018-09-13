class Solution {
  constructor (sum, firstNom, secNom, firstCount, secCount, remain, percent) { // we'll have array, containing different solutions, so we need this class
    this.sum = sum;                       // all cash needed to pay
    this.firstNom = firstNom;             // price of 1st and 2nd coin
    this.secNom = secNom;
    this.firstCount = firstCount;         // count of coins
    this.secCount = secCount;
    this.remain = remain;
    this.percent = percent;                 // percent we need
    this.realPercent = 0;                   // percent we really have
  }
}
function Solve() {
  var errString = "Error!" + "\n";
  var errFlag = false;

  if ((!isNaN(document.getElementById("sum").value)) && document.getElementById("sum").value > 0 && +document.getElementById("sum").value == Math.floor(document.getElementById("sum").value)) { // checking incoming data type and values
      var sum = document.getElementById("sum").value;
  }
  else{
    errString += "Sum must be a positive number!" + "\n";           //if smth is bad - update "error log" and raise error flag
    errFlag = true;
  }

  if ((!isNaN(document.getElementById("firstPrice").value)) && document.getElementById("firstPrice").value > 0 && +document.getElementById("firstPrice").value < +document.getElementById("sum").value && +document.getElementById("firstPrice").value == Math.floor(document.getElementById("firstPrice").value))
    var firstPrice = document.getElementById("firstPrice").value;
  else{
    errString += "First price must be a positive number lower than sum!" + "\n";
    errFlag = true;
  }

  if ((!isNaN(document.getElementById("secPrice").value)) && document.getElementById("secPrice").value > 0 && +document.getElementById("secPrice").value != firstPrice && +document.getElementById("secPrice").value < +document.getElementById("sum").value && +document.getElementById("secPrice").value == Math.floor(document.getElementById("secPrice").value))
    var secPrice = document.getElementById("secPrice").value;
  else{
    errString += "Second price must be a positive number different from first price and lower than sum!" + "\n";
    errFlag = true;
  }

  if ((!isNaN(document.getElementById("percent").value)) && document.getElementById("percent").value >= 0 && document.getElementById("percent").value <= 100 && +document.getElementById("percent").value == Math.floor(document.getElementById("percent").value))
    var percent = document.getElementById("percent").value;
  else{
    errString += "Percent must be a number between 0 and 100!" + "\n";
    errFlag = true;
  }

  if (errFlag){       // if errors were detected - show error message ant exit
    alert(errString);
    return 0;
  }

  if (firstPrice < secPrice){ // for algorythm working correctly i need firstPrice to be higher than secPrice, so if it's not so - swap
    let cont = firstPrice;
    firstPrice = secPrice;
    secPrice = cont;
  }

  //alert ("rakataka " + document.getElementById("sum").value);
  var solutionArray = new Array();                                                  //creating array where all solutions will be
  solutionArray[0] = new Solution(sum, firstPrice, secPrice, -1, -1, 0, percent);   //filling 1st solution with input data
  var currSol = solutionArray[0];
  currSol.firstCount = Math.floor(currSol.sum / currSol.firstNom);                  // we'll take highest possible count of 1st coin
  currSol.secCount = Math.floor((currSol.sum % currSol.firstNom) / currSol.secNom);   // and the remain will be divided between max count of 2nd coin
  currSol.remain = currSol.sum % currSol.firstNom % currSol.secNom;                   // and remain itself

  //alert ("sum " + currSol.sum + " = " + currSol.firstNom + "*" + currSol.firstCount + " + " + currSol.secNom + "*" + currSol.secCount + " + " + currSol.remain);

  currSol.realPercent = Math.floor(currSol.firstCount / (currSol.firstCount + currSol.secCount) * 100); // counting what percent we have in this solution
  //alert ("percent " + currSol.realPercent);


  /*
    In this while, every iteration we reduce count of 1st coins on 1, "converting" one 1st coin into some 2nd coins
    For example if 1st solution was: 10 = 5*2 + 0*2 + 0
    So the 2nd one will be: 10 = 5*1 + 2*2 + 1

    But also not that simple cases are possible

    while is working until 1st coins count is not 0
   */
  var i = 1;
  while (currSol.firstCount != 0) {
    solutionArray[i] = new Solution(solutionArray[i-1].sum, solutionArray[i-1].firstNom, solutionArray[i-1].secNom, solutionArray[i-1].firstCount, solutionArray[i-1].secCount, solutionArray[i-1].remain, solutionArray[i-1].percent);
    currSol = solutionArray[i];
    currSol.firstCount -= 1;
    currSol.secCount += Math.floor(currSol.firstNom / currSol.secNom);
    currSol.remain = currSol.sum - currSol.firstCount * currSol.firstNom - currSol.secCount * currSol.secNom; //filling solution like told before
    //alert ("sum before " + solutionArray[i].sum + " = " + solutionArray[i].firstNom + "*" + solutionArray[i].firstCount + " + " + solutionArray[i].secNom + "*" + solutionArray[i].secCount + " + " + solutionArray[i].remain);

    /*
      Previous step was: 10 = 5*1 + 2*2 + 1
      Reducing 1st coins and adding 2nd we get: 10 = 5*0 + 2*4 + 2
      But now our remain is equal to 2nd coin price, so we change solution to this: 10 = 5*0 + 2*5 + 0
      This if is working on it
     */

    if (currSol.remain >= currSol.secNom){
      currSol.secCount += 1;
      currSol.remain -= currSol.secNom;
    }

    currSol.realPercent = Math.floor(currSol.firstCount / (currSol.firstCount + currSol.secCount) * 100); //counting real percent after all

    /*alert ("sum " + solutionArray[i].sum + " = " + solutionArray[i].firstNom + "*" + solutionArray[i].firstCount + " + " + solutionArray[i].secNom + "*" + solutionArray[i].secCount + " + " + solutionArray[i].remain);
    alert ("percent " + currSol.realPercent);*/

    i++;
  }
  /*
    Now we have ALL POSSIBLE solutions in our array and we need to choose one, according to our task
    First we'll check if we have 0-remain solutions
    If we do - we delete all others, cause 0-remain is main condition
    Than we sort all remainig solutions by ascending of value |realPercent - percent|
    And choose the lowest, so the nearest one to count we need
   */


  solutionArray.sort(function (a, b) { // sort ascending by remain
    if (a.remain > b.remain){
      return 1;
    }
    if (b.remain > a.remain){
      return -1;
    }
    return 0;
  });


  var j = 0;

  if (solutionArray[0].remain == 0){            //if we have any 0-remain solutions 1st will be here
    for (j = 0; j < solutionArray.length; j++) {// if there are any 0-rem solutions we look fo 1st non-0-remain solution
      if (solutionArray[j].remain != 0) {
        break;
      }
    }
    solutionArray.splice(j, solutionArray.length - j);  // and delete all after it
  }

 /*alert ("printing array");
  for (j = 0; j < solutionArray.length; j++)
    alert ("sum " + solutionArray[j].sum + " = " + solutionArray[j].firstNom + "*" + solutionArray[j].firstCount + " + " + solutionArray[j].secNom + "*" + solutionArray[j].secCount + " + " + solutionArray[j].remain);
*/
  solutionArray.sort(function (a, b) {                                              // sorting solutions by |realPercent - percent|
    if (Math.abs(a.percent - a.realPercent) > Math.abs(b.percent - b.realPercent))
      return 1;
    if (Math.abs(a.percent - a.realPercent) < Math.abs(b.percent - b.realPercent))
      return -1;

    return 0;
  });

  /*alert ("after 2nd sort");
  for (j = 0; j < solutionArray.length; j++)
    alert (solutionArray[j].realPercent + " " + solutionArray[j].percent);
  */

  //printing answer with lowest diference
  alert ("Answer: Percent: " + solutionArray[0].realPercent + "%; Check: " + solutionArray[0].sum + " = " + solutionArray[0].firstNom + "*" + solutionArray[0].firstCount + " + " + solutionArray[0].secNom + "*" + solutionArray[0].secCount + " + " + solutionArray[0].remain);
  return 0;
}


