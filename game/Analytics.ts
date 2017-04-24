interface IPosition {
   x: number,
   y: number
}

interface IPayload {
   date: string, // date
   seed: number, // seeded value
   started: number, // time
   timePlayed: number, // amount of time played
   won: boolean, // won or lost
   enemiesOnScreen: number, 
   foodCollected: string[],
   playerPositions: IPosition[]
   enemyPositions: IPosition[],
}

class Analytics {


   public static publish(payload: IPayload){
      return fetch(Config.analyticsEndpoint, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(payload)
      });
   }   
   
}