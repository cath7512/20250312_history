// Historical data for the Imjin War (Korea-Japan War 1592-1598)
const warData = {
  "imjin-war": {
    name: "Japanese invasions of Korea (1592-1598)",
    startDate: { year: 1592, month: 5 },
    endDate: { year: 1598, month: 12 },
    wikipediaUrl:
      "https://en.wikipedia.org/wiki/Japanese_invasions_of_Korea_(1592%E2%80%931598)",
    wikiContentMapping: {
      // Maps months to sections in Wikipedia article for sync
      "1592-05": "#Initial_attacks",
      "1592-06": "#Capture_of_Hanseong",
      "1592-07": "#Advance_to_Pyongyang",
      "1592-08": "#Naval_campaigns_of_1592",
      "1592-09": "#Korean_resistance",
      "1592-10": "#Ming_intervention",
      "1593-01": "#Siege_of_Pyongyang",
      "1593-02": "#Battle_of_Byeokjegwan",
      "1593-03": "#Recapture_of_Seoul",
      "1593-05": "#Peace_negotiations",
      "1597-01": "#Second_invasion",
      "1597-02": "#Battle_of_Namwon",
      "1597-07": "#Battle_of_Chilcheollyang",
      "1597-10": "#Battle_of_Myeongnyang",
      "1598-09": "#Death_of_Hideyoshi",
      "1598-11": "#Battle_of_Noryang",
      "1598-12": "#Japanese_withdrawal",
    },
    timeline: [
      {
        date: { year: 1592, month: 5 },
        events: [
          {
            type: "invasion",
            description:
              "Japanese forces led by Toyotomi Hideyoshi invade Korea at Busan, marking the beginning of the Imjin War",
            location: { lat: 35.1796, lng: 129.0756 },
            troops: [
              {
                japanese: [
                  {
                    type: "main force",
                    forces: {
                      army: {
                        count: 140000,
                        icon: "./resources/img/soldier_japanese.png",
                      },
                      naval: {
                        count: 18000,
                        ships: 700,
                        icon: "./resources/img/old-ship.png",
                      },
                    },
                    location: { lat: 34.4167, lng: 129.3333 },
                    icon: "./resources/img/soldier_japanese2.png",
                    color: "#e0451e",
                    commander: "Konishi Yukinaga",
                  },
                  {
                    type: "reinforcements",
                    forces: {
                      army: {
                        count: 12000,
                        icon: "./resources/img/soldier_japanese.png",
                      },
                    },
                    color: "#e6a697",
                    icon: "./resources/img/soldier_japanese2.png",
                    commander: "Kuroda Nagamasa",
                    date: { month: 5, day: 20 },
                    location: { lat: 35.229, lng: 129.091 }, // outskirts of Busan
                  },
                ],
                korean: [
                  {
                    type: "main force",
                    forces: {
                      army: {
                        count: 5000,
                        icon: "./resources/img/soldier_joseon2.png",
                      },
                      naval: {
                        count: 1000,
                        icon: "./resources/img/old-ship.png",
                      },
                    },
                    location: {
                      lat: 35.1796,
                      lng: 129.0756,
                    },
                    color: "#3daa0a",
                    icon: "./resources/img/soldier_joseon.png",
                    commander: "Jeong Bal",
                    defenses: "wooden fortress and coastal barriers",
                  },
                  {
                    type: "reinforcements",
                    forces: {
                      army: {
                        count: 25000,
                        icon: "./resources/img/soldier_joseon2.png",
                      },
                    },
                    commander: "Yi Il",
                    color: "#84ad71",
                    icon: "./resources/img/soldier_joseon.png",
                    date: { month: 5, day: 10 },
                    location: { lat: 36.1111, lng: 128.3333 }, // Gyeongju
                  },
                ],
              },
            ],
            soundEffect: "./resources/sound/naval_battle.mp3",
            movements: [
              {
                from: { lat: 34.4167, lng: 129.3333 }, // Tsushima, Japan
                to: { lat: 35.1796, lng: 129.0756 }, // Busan
                troops: { japanese: { army: 140000, naval: 18000 } },
                strategy: "naval landing followed by rapid land march",
              },
              {
                from: { lat: 35.1796, lng: 129.0756 }, // Busan
                to: { lat: 35.5384, lng: 129.317 }, // Daegu
                troops: { japanese: { army: 120000 } },
                strategy:
                  "divide and conquer Korean defenses along the Nakdong River",
              },
            ],
          },
        ],
        narration:
          "On May 23, 1592, Japanese forces under Toyotomi Hideyoshi launched a massive invasion of Korea, landing at Busan with approximately 158,000 troops. The Korean forces at Busan, consisting of only about 6,000 soldiers, were quickly overwhelmed. This marked the beginning of the Imjin War, which would last for over six years.",
      },
      {
        date: { year: 1592, month: 6 },
        events: [
          {
            type: "battle",
            name: "Battle of Sangju",
            description:
              "First major battle on Korean soil between Japanese and Korean forces",
            location: { lat: 36.415, lng: 128.1292 },
            troops: [
              {
                japanese: [{ count: 18000, lat: 36.415, lng: 128.1292 }],
                korean: [{ count: 8000, lat: 36.415, lng: 128.1292 }],
              },
            ],
            result: "Japanese victory",
            soundEffect: "./resources/sound/battle.mp3",
          },
          {
            type: "movement",
            description:
              "Japanese forces advance toward Seoul, capturing strategic points along the way",
            movements: [
              {
                from: { lat: 35.1796, lng: 129.0756 }, // Busan
                to: { lat: 37.5665, lng: 126.978 }, // Seoul
                troops: { japanese: 53000 },
              },
            ],
          },
        ],
        narration:
          "By June 1592, Japanese forces had advanced rapidly northward through the Korean peninsula. The Battle of Sangju was the first major engagement between Japanese and Korean forces on land, ending in a Japanese victory despite being outnumbered. Afterward, Japanese troops continued their advance toward Seoul, capturing strategic points and overwhelming Korean defenses.",
      },
      {
        date: { year: 1592, month: 7 },
        events: [
          {
            type: "battle",
            name: "Battle of Chungju",
            description: "Decisive battle that opened the path to Seoul",
            location: { lat: 37.0073, lng: 127.8744 },
            troops: [
              {
                japanese: [{ count: 30000, lat: 37.0073, lng: 127.8744 }],
                korean: [{ count: 12000, lat: 37.0073, lng: 127.8744 }],
              },
            ],
            result: "Japanese victory",
            soundEffect: "./resources/sound/battle.mp3",
          },
          {
            type: "capture",
            description:
              "Japanese forces capture Seoul, forcing King Seonjo to flee",
            location: { lat: 37.5665, lng: 126.978 },
            troops: [
              {
                japanese: [{ count: 50000, lat: 37.5665, lng: 126.978 }],
              },
            ],
          },
        ],
        narration:
          "In July 1592, Japanese forces defeated Korean troops at the Battle of Chungju, which opened the way to the capital. Seoul was captured on July 10, as King Seonjo had already fled to the north. The fall of the capital was a devastating blow to Korean morale and marked a significant turning point in the war.",
      },
      {
        date: { year: 1592, month: 8 },
        events: [
          {
            type: "naval_battle",
            name: "Battle of Hansan Island",
            description:
              "Admiral Yi Sun-sin's decisive victory using turtle ships",
            location: { lat: 34.7306, lng: 128.4658 },
            troops: [
              {
                japanese: [{ count: 73, lat: 34.7306, lng: 128.4658 }],
                korean: [{ count: 56, lat: 34.7306, lng: 128.4658 }],
              },
            ],
            result: "Korean victory",
            soundEffect: "./resources/sound/naval_battle.mp3",
          },
        ],
        narration:
          "August 1592 saw one of the most significant naval victories in Korean history. Admiral Yi Sun-sin's innovative 'turtle ships' and brilliant tactical maneuvers led to a decisive victory at the Battle of Hansan Island, where he destroyed 73 Japanese ships while losing none of his own. This victory helped cut off Japanese supply lines and significantly hindered their advance.",
      },
      {
        date: { year: 1592, month: 9 },
        events: [
          {
            type: "resistance",
            description: "Korean resistance movement begins to organize",
            location: { lat: 36.3504, lng: 127.3845 },
            troops: [
              {
                korean: [{ count: 5000, lat: 36.3504, lng: 127.3845 }],
              },
            ],
          },
        ],
        narration:
          "By September 1592, Korean resistance movements began to organize more effectively. Local militias and Buddhist monk soldiers started to coordinate their efforts against the Japanese occupation, marking the beginning of a more organized resistance.",
      },
      {
        date: { year: 1592, month: 10 },
        events: [
          {
            type: "intervention",
            description: "Ming Chinese forces begin arriving in Korea",
            location: { lat: 39.0392, lng: 125.7625 },
            troops: [
              {
                chinese: [{ count: 5000, lat: 39.0392, lng: 125.7625 }],
              },
            ],
          },
        ],
        narration:
          "In October 1592, the first Ming Chinese forces arrived in Korea to assist in repelling the Japanese invasion. This marked the beginning of direct Chinese military intervention in the conflict.",
      },
      {
        date: { year: 1593, month: 1 },
        events: [
          {
            type: "battle",
            name: "Battle of Pyongyang",
            description:
              "Combined Korean and Ming forces retake Pyongyang from Japanese control",
            location: { lat: 39.0392, lng: 125.7625 },
            troops: [
              {
                japanese: [{ count: 15000, lat: 39.0392, lng: 125.7625 }],
                korean: [{ count: 5000, lat: 39.0392, lng: 125.7625 }],
                chinese: [{ count: 20000, lat: 39.0392, lng: 125.7625 }],
              },
            ],
            result: "Korean-Ming victory",
            soundEffect: "./resources/sound/battle.mp3",
          },
          {
            type: "movement",
            description: "Japanese forces retreat from Pyongyang after defeat",
            movements: [
              {
                from: { lat: 39.0392, lng: 125.7625 }, // Pyongyang
                to: { lat: 37.5665, lng: 126.978 }, // Seoul
                troops: { japanese: 12000 },
              },
            ],
          },
        ],
        narration:
          "In January 1593, combined Korean and Ming Chinese forces totaling about 25,000 troops attacked Pyongyang, which was held by 15,000 Japanese soldiers. After a fierce battle, allied forces recaptured the city, forcing the Japanese to retreat southward toward Seoul. This marked a significant turning point in the war, as it was the first major defeat of Japanese forces on land.",
      },
      {
        date: { year: 1593, month: 2 },
        events: [
          {
            type: "battle",
            name: "Battle of Byeokjegwan",
            description: "Major battle between Japanese and Ming forces",
            location: { lat: 37.8833, lng: 126.75 },
            troops: [
              {
                japanese: [{ count: 30000, lat: 37.8833, lng: 126.75 }],
                chinese: [{ count: 10000, lat: 37.8833, lng: 126.75 }],
              },
            ],
            result: "Japanese victory",
          },
        ],
        narration:
          "The Battle of Byeokjegwan in February 1593 was a significant engagement between Japanese and Ming forces. Despite being outnumbered, Japanese forces achieved a tactical victory, demonstrating their military effectiveness.",
      },
      {
        date: { year: 1593, month: 3 },
        events: [
          {
            type: "capture",
            description: "Allied forces recapture Seoul",
            location: { lat: 37.5665, lng: 126.978 },
            troops: [
              {
                japanese: [{ count: 20000, lat: 37.5665, lng: 126.978 }],
                korean: [{ count: 10000, lat: 37.5665, lng: 126.978 }],
                chinese: [{ count: 15000, lat: 37.5665, lng: 126.978 }],
              },
            ],
          },
        ],
        narration:
          "In March 1593, combined Korean and Ming forces successfully recaptured Seoul from Japanese control. This was a major turning point in the war, as it demonstrated the effectiveness of the allied forces working together.",
      },
      {
        date: { year: 1593, month: 5 },
        events: [
          {
            type: "peace",
            description:
              "Truce negotiations begin between Japan, Korea, and Ming China",
            location: { lat: 38.3311, lng: 126.1809 },
          },
        ],
        narration:
          "By May 1593, with supply lines stretched and facing stronger resistance from Korean and Ming forces, Japanese forces had been pushed back to the southeastern coastal areas. Truce negotiations began between the Japanese, Koreans, and Chinese, though these would ultimately fail to bring lasting peace.",
      },
      {
        date: { year: 1597, month: 1 },
        events: [
          {
            type: "invasion",
            description:
              "Second Japanese invasion begins after failed peace negotiations",
            location: { lat: 35.1796, lng: 129.0756 }, // Busan
            troops: [
              {
                japanese: [{ count: 140000, lat: 35.1796, lng: 129.0756 }],
              },
            ],
            movements: [
              {
                from: { lat: 34.2333, lng: 130.3 }, // Tsushima
                to: { lat: 35.1796, lng: 129.0756 }, // Busan
                troops: { japanese: 140000 },
              },
            ],
          },
        ],
        narration:
          "In January 1597, after failed peace negotiations, Toyotomi Hideyoshi launched a second invasion of Korea with approximately 140,000 troops. This time, Japanese forces were better prepared for Korean naval tactics and the involvement of Ming Chinese forces, though they would face even stronger resistance.",
      },
      {
        date: { year: 1597, month: 2 },
        events: [
          {
            type: "battle",
            name: "Battle of Namwon",
            description: "Major battle during the second invasion",
            location: { lat: 35.4167, lng: 127.3833 },
            troops: [
              {
                japanese: [{ count: 56000, lat: 35.4167, lng: 127.3833 }],
                korean: [{ count: 3000, lat: 35.4167, lng: 127.3833 }],
                chinese: [{ count: 3000, lat: 35.4167, lng: 127.3833 }],
              },
            ],
            result: "Japanese victory",
          },
        ],
        narration:
          "The Battle of Namwon in February 1597 was one of the major battles during the second Japanese invasion. Despite fierce resistance, the Japanese forces overwhelmed the defending Korean and Chinese troops.",
      },
      {
        date: { year: 1597, month: 7 },
        events: [
          {
            type: "naval_battle",
            name: "Battle of Chilcheollyang",
            description: "Major naval defeat for Korean forces",
            location: { lat: 34.6333, lng: 127.4667 },
            troops: [
              {
                japanese: [{ count: 500, lat: 34.6333, lng: 127.4667 }],
                korean: [{ count: 200, lat: 34.6333, lng: 127.4667 }],
              },
            ],
            result: "Japanese victory",
          },
        ],
        narration:
          "The Battle of Chilcheollyang in July 1597 was a significant naval defeat for the Korean navy. The Japanese fleet successfully ambushed and destroyed most of the Korean ships, marking one of the few major Japanese naval victories of the war.",
      },
      {
        date: { year: 1597, month: 10 },
        events: [
          {
            type: "naval_battle",
            name: "Battle of Myeongnyang",
            description:
              "Admiral Yi's remarkable victory against overwhelming odds",
            location: { lat: 34.5667, lng: 126.3 },
            troops: [
              {
                japanese: [{ count: 333, lat: 34.5667, lng: 126.3 }],
                korean: [{ count: 13, lat: 34.5667, lng: 126.3 }],
              },
            ],
            result: "Korean victory",
            soundEffect: "./resources/sound/naval_battle.mp3",
          },
        ],
        narration:
          "In October 1597, Admiral Yi Sun-sin achieved perhaps his most remarkable victory at the Battle of Myeongnyang. With only 13 ships against a Japanese fleet of 333, he used the narrow strait's strong currents to his advantage, sinking 31 Japanese ships without losing any of his own. This victory demonstrated his exceptional naval leadership and tactical brilliance.",
      },
      {
        date: { year: 1598, month: 9 },
        events: [
          {
            type: "death",
            description:
              "Toyotomi Hideyoshi dies in Japan, leading to the end of the war",
            location: { lat: 34.6937, lng: 135.5022 }, // Osaka
          },
        ],
        narration:
          "In September 1598, Toyotomi Hideyoshi, the architect of the Japanese invasions, died in Japan. His death would prove crucial to the end of the war, as Japanese leadership became divided over whether to continue the campaign. This event marked the beginning of the end for the Japanese invasion.",
      },
      {
        date: { year: 1598, month: 11 },
        events: [
          {
            type: "naval_battle",
            name: "Battle of Noryang",
            description:
              "Final major battle of the war, where Admiral Yi Sun-sin was killed",
            location: { lat: 34.9344, lng: 127.8572 },
            troops: [
              {
                japanese: [{ count: 500, lat: 34.9344, lng: 127.8572 }],
                korean: [{ count: 150, lat: 34.9344, lng: 127.8572 }],
                chinese: [{ count: 100, lat: 34.9344, lng: 127.8572 }],
              },
            ],
            result: "Korean-Ming victory",
            soundEffect: "./resources/sound/naval_battle.mp3",
          },
        ],
        narration:
          "The Battle of Noryang in November 1598 was the final major battle of the war. While the Korean and Ming navies achieved victory, Admiral Yi Sun-sin was fatally wounded by a stray bullet. His last words were reportedly, 'The battle is at its height. Do not announce my death.' His death marked the loss of one of Korea's greatest military heroes.",
      },
      {
        date: { year: 1598, month: 12 },
        events: [
          {
            type: "withdrawal",
            description:
              "Complete Japanese withdrawal from Korea, ending the seven-year war",
            soundEffect: "./resources/sound/naval_battle.mp3",
            movements: [
              {
                from: { lat: 35.1796, lng: 129.0756 }, // Busan
                to: { lat: 34.2333, lng: 130.3 }, // Tsushima
                troops: { japanese: 100000 },
              },
            ],
          },
        ],
        narration:
          "By December 1598, all Japanese forces had withdrawn from Korean soil, ending the seven-year war. The conflict resulted in tremendous destruction and loss of life in Korea, while also significantly weakening the Japanese economy. The Ming dynasty, though victorious, was financially strained by the war effort, contributing to its eventual decline. The war left lasting impacts on all three nations involved.",
      },
    ],
  },
};

// Sound effects data
const soundEffects = {
  battle: "battle.mp3",
  naval_battle: "naval_battle.mp3",
  march: "naval_battle.mp3",
  speech: "speech.mp3",
};
