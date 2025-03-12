// Historical data for the Imjin War (Korea-Japan War 1592-1598)
const warData = {
  "imjin-war": {
    name: "Korea-Japan War (Imjin War)",
    startDate: { year: 1592, month: 5 },
    endDate: { year: 1598, month: 12 },
    wikipediaUrl: "https://en.wikipedia.org/wiki/Japanese_invasions_of_Korea_(1592%E2%80%931598)",
    wikiContentMapping: {
      // Maps months to sections in Wikipedia article for sync
      "1592-05": "#First_phase:_1592-1593",
      "1592-06": "#The_Japanese_invasion_begins",
      "1592-08": "#The_Joseon_and_Ming_counter-offensive",
      "1593-01": "#Battle_of_Pyongyang",
      "1597-01": "#Second_phase:_1597-1598",
      "1598-11": "#Final_Allied_offensive",
      "1598-12": "#Japanese_withdrawal"
    },
    timeline: [
      {
        date: { year: 1592, month: 5 },
        events: [
          {
            type: "invasion",
            description: "Japanese forces led by Toyotomi Hideyoshi invade Korea at Busan",
            location: { lat: 35.1796, lng: 129.0756 },
            troops: { japanese: 158000, korean: 6000 },
            movements: [
              { 
                from: { lat: 34.2333, lng: 130.3000 }, // Tsushima, Japan
                to: { lat: 35.1796, lng: 129.0756 }, // Busan
                troops: { japanese: 158000 }
              }
            ]
          }
        ],
        narration: "In May 1592, Japanese forces under Toyotomi Hideyoshi launched a massive invasion of Korea, landing at Busan with approximately 158,000 troops. The Korean forces at Busan, consisting of only about 6,000 soldiers, were quickly overwhelmed."
      },
      {
        date: { year: 1592, month: 6 },
        events: [
          {
            type: "battle",
            name: "Battle of Sangju",
            description: "First major battle on Korean soil",
            location: { lat: 36.4150, lng: 128.1292 },
            troops: { japanese: 18000, korean: 8000 },
            result: "Japanese victory",
            soundEffect: "./resources/sound/battle.mp3"
          },
          {
            type: "movement",
            description: "Japanese forces advance toward Seoul",
            movements: [
              { 
                from: { lat: 35.1796, lng: 129.0756 }, // Busan
                to: { lat: 37.5665, lng: 126.9780 }, // Seoul
                troops: { japanese: 53000 }
              }
            ]
          }
        ],
        narration: "By June 1592, Japanese forces had advanced rapidly northward. The Battle of Sangju was the first major engagement between Japanese and Korean forces on land, ending in a Japanese victory. Afterward, Japanese troops continued their advance toward Seoul."
      },
      {
        date: { year: 1592, month: 7 },
        events: [
          {
            type: "battle",
            name: "Battle of Chungju",
            description: "Major battle before the capture of Seoul",
            location: { lat: 37.0073, lng: 127.8744 },
            troops: { japanese: 30000, korean: 12000 },
            result: "Japanese victory",
            soundEffect: "./resources/sound/battle.mp3"
          },
          {
            type: "capture",
            description: "Japanese forces capture Seoul",
            location: { lat: 37.5665, lng: 126.9780 },
            troops: { japanese: 50000 }
          }
        ],
        narration: "In July 1592, Japanese forces defeated Korean troops at the Battle of Chungju, which opened the way to the capital. Seoul was captured on July 10, as King Seonjo had already fled to the north. The fall of the capital was a devastating blow to Korean morale."
      },
      {
        date: { year: 1592, month: 8 },
        events: [
          {
            type: "naval_battle",
            name: "Battle of Hansan Island",
            description: "Admiral Yi Sun-sin's famous victory",
            location: { lat: 34.7306, lng: 128.4658 },
            troops: { japanese: 73, korean: 56 }, // ships, not soldiers
            result: "Korean victory",
            soundEffect: "./resources/sound/naval_battle.mp3"
          }
        ],
        narration: "August 1592 saw one of the most significant naval victories in Korean history. Admiral Yi Sun-sin's innovative 'turtle ships' and brilliant tactical maneuvers led to a decisive victory at the Battle of Hansan Island, where he destroyed 73 Japanese ships while losing none of his own."
      },
      {
        date: { year: 1593, month: 1 },
        events: [
          {
            type: "battle",
            name: "Battle of Pyongyang",
            description: "Ming Chinese forces join Koreans to retake Pyongyang",
            location: { lat: 39.0392, lng: 125.7625 },
            troops: { japanese: 15000, korean: 5000, chinese: 20000 },
            result: "Korean-Ming victory",
            soundEffect: "./resources/sound/battle.mp3"
          },
          {
            type: "movement",
            description: "Japanese retreat from Pyongyang",
            movements: [
              { 
                from: { lat: 39.0392, lng: 125.7625 }, // Pyongyang
                to: { lat: 37.5665, lng: 126.9780 }, // Seoul
                troops: { japanese: 12000 }
              }
            ]
          }
        ],
        narration: "In January 1593, combined Korean and Ming Chinese forces totaling about 25,000 troops attacked Pyongyang, which was held by 15,000 Japanese soldiers. After a fierce battle, allied forces recaptured the city, forcing the Japanese to retreat southward toward Seoul."
      },
      {
        date: { year: 1593, month: 5 },
        events: [
          {
            type: "peace",
            description: "Truce talks begin",
            location: { lat: 38.3311, lng: 126.1809 }
          }
        ],
        narration: "By May 1593, with supply lines stretched and facing stronger resistance, Japanese forces had been pushed back to the southeastern coastal areas. Truce negotiations began between the Japanese, Koreans, and Chinese."
      },
      {
        date: { year: 1597, month: 1 },
        events: [
          {
            type: "invasion",
            description: "Second Japanese invasion begins",
            location: { lat: 35.1796, lng: 129.0756 }, // Busan
            troops: { japanese: 140000 },
            movements: [
              { 
                from: { lat: 34.2333, lng: 130.3000 }, // Tsushima
                to: { lat: 35.1796, lng: 129.0756 }, // Busan
                troops: { japanese: 140000 }
              }
            ]
          }
        ],
        narration: "In January 1597, after failed peace negotiations, Toyotomi Hideyoshi launched a second invasion of Korea with approximately 140,000 troops. This time, Japanese forces were better prepared for Korean naval tactics and the involvement of Ming Chinese forces."
      },
      {
        date: { year: 1597, month: 10 },
        events: [
          {
            type: "naval_battle",
            name: "Battle of Myeongnyang",
            description: "Admiral Yi's famous victory with only 13 ships",
            location: { lat: 34.5667, lng: 126.3000 },
            troops: { japanese: 333, korean: 13 }, // ships
            result: "Korean victory",
            soundEffect: "./resources/sound/naval_battle.mp3"
          }
        ],
        narration: "In October 1597, Admiral Yi Sun-sin achieved perhaps his most remarkable victory at the Battle of Myeongnyang. With only 13 ships against a Japanese fleet of 333, he used the narrow strait's strong currents to his advantage, sinking 31 Japanese ships without losing any of his own."
      },
      {
        date: { year: 1598, month: 9 },
        events: [
          {
            type: "death",
            description: "Toyotomi Hideyoshi dies in Japan",
            location: { lat: 34.6937, lng: 135.5022 } // Osaka
          }
        ],
        narration: "In September 1598, Toyotomi Hideyoshi, the architect of the Japanese invasions, died in Japan. His death would prove crucial to the end of the war, as Japanese leadership became divided over whether to continue the campaign."
      },
      {
        date: { year: 1598, month: 11 },
        events: [
          {
            type: "naval_battle",
            name: "Battle of Noryang",
            description: "Final major battle of the war, Admiral Yi killed",
            location: { lat: 34.9344, lng: 127.8572 },
            troops: { japanese: 500, korean: 150, chinese: 100 }, // ships
            result: "Korean-Ming victory",
            soundEffect: "./resources/sound/naval_battle.mp3"
          }
        ],
        narration: "The Battle of Noryang in November 1598 was the final major battle of the war. While the Korean and Ming navies achieved victory, Admiral Yi Sun-sin was fatally wounded by a stray bullet. His last words were reportedly, 'The battle is at its height. Do not announce my death.'"
      },
      {
        date: { year: 1598, month: 12 },
        events: [
          {
            type: "withdrawal",
            description: "Complete Japanese withdrawal from Korea",
            movements: [
              { 
                from: { lat: 35.1796, lng: 129.0756 }, // Busan
                to: { lat: 34.2333, lng: 130.3000 }, // Tsushima
                troops: { japanese: 100000 }
              }
            ]
          }
        ],
        narration: "By December 1598, all Japanese forces had withdrawn from Korean soil, ending the seven-year war. The conflict resulted in tremendous destruction and loss of life in Korea, while also significantly weakening the Japanese economy. The Ming dynasty, though victorious, was financially strained by the war effort, contributing to its eventual decline."
      }
    ]
  }
};

// Sound effects data
const soundEffects = {
  battle: "battle.mp3",
  naval_battle: "naval_battle.mp3",
  march: "naval_battle.mp3",
  speech: "speech.mp3"
}; 