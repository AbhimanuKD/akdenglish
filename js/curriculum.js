export const SKILLS = [
  { id: "vocabulary", label: "Vocabulary" },
  { id: "sentences", label: "Sentence building" },
  { id: "grammar", label: "Grammar in context" },
  { id: "spelling", label: "Spelling" },
  { id: "punctuation", label: "Punctuation" },
  { id: "organization", label: "Organization" },
  { id: "clarity", label: "Clarity" },
  { id: "tone", label: "Tone" },
  { id: "editing", label: "Editing" }
];

export const TOPICS = {
  "daily-life": "Daily life",
  work: "Work",
  education: "Education",
  travel: "Travel",
  hobbies: "Hobbies",
  general: "General topics"
};

export const WRITING_TYPES = {
  everyday: "Everyday writing",
  personal: "Personal introduction",
  description: "Description",
  message: "Message",
  story: "Story",
  email: "Email",
  work: "Work writing",
  school: "School writing",
  opinion: "Opinion",
  review: "Review",
  report: "Report",
  essay: "Essay"
};

export const LEVELS = [
  {
    id: "A1",
    cefr: "A1",
    name: "Beginner",
    tagline: "Your first steps in English writing",
    description: "You will learn to write simple words and short sentences about yourself and your daily life. You will practise spelling, basic word order, and full stops.",
    ableToWrite: "You will slowly learn to write short, clear sentences about who you are, where you live, and what you do each day. You will be able to fill in simple forms and write very short messages.",
    timeRange: "15-30 minutes a day",
    units: [
      {
        id: "A1-u1",
        title: "My first sentences",
        topic: "daily-life",
        activities: [
          {
            id: "A1-u1-a1",
            title: "Write your first sentences",
            type: "everyday",
            skills: ["vocabulary", "sentences"],
            instructions: "Write three short sentences about your home. Use simple words you know.",
            example: "I live in a small flat. It has two rooms. I like my home.",
            exampleNote: "Each sentence has a subject and a verb.",
            tip: "A sentence always starts with a capital letter.",
            prompt: "Write three sentences about where you live. Name the place and say one thing you like about it.",
            choices: ["My home", "My town"],
            minWords: 15
          },
          {
            id: "A1-u1-a2",
            title: "Name the things around you",
            type: "everyday",
            skills: ["vocabulary", "spelling"],
            instructions: "List five things you see in your room. Write each one correctly.",
            example: "a bed, a lamp, a window, a chair, a book",
            exampleNote: "Use 'a' before things that are one of many.",
            tip: "Check the spelling of each word twice.",
            prompt: "Write a list of five things in your room. Put 'a' before each one.",
            choices: ["My bedroom", "My kitchen"],
            minWords: 15
          },
          {
            id: "A1-u1-a3",
            title: "Put the words in order",
            type: "everyday",
            skills: ["sentences", "grammar"],
            instructions: "Write three sentences with the pattern 'I have a ...'. Keep the word order subject, verb, object.",
            example: "I have a blue bag. I have a phone. I have a notebook.",
            exampleNote: "Subject first, then the verb, then the thing.",
            tip: "Start with I, then have, then a, then the thing.",
            prompt: "Write three sentences about things you have. Use 'I have a ...' for each one.",
            choices: ["Things for school", "Things for work"],
            minWords: 15
          }
        ]
      },
      {
        id: "A1-u2",
        title: "About me",
        topic: "general",
        activities: [
          {
            id: "A1-u2-a1",
            title: "Introduce yourself",
            type: "personal",
            skills: ["sentences", "vocabulary"],
            instructions: "Write four sentences to introduce yourself. Say your name, age, and one thing you like.",
            example: "My name is Ana. I am twenty years old. I am from Brazil. I like music.",
            exampleNote: "Use 'I am' to talk about yourself.",
            tip: "If you are not sure, write 'I am' instead of 'I'm'.",
            prompt: "Write four sentences to introduce yourself to a new friend.",
            choices: ["Introduce yourself", "Introduce a friend"],
            minWords: 20
          },
          {
            id: "A1-u2-a2",
            title: "Describe your family",
            type: "description",
            skills: ["vocabulary", "sentences"],
            instructions: "Write three sentences about your family. Say how many people and name one person.",
            example: "I have a small family. My sister is kind. My father likes to cook.",
            exampleNote: "Use 'my' to talk about people in your family.",
            tip: "Family words: mother, father, sister, brother.",
            prompt: "Write three sentences about your family. Name two people and say one thing about each.",
            choices: ["My family", "My friends"],
            minWords: 20
          },
          {
            id: "A1-u2-a3",
            title: "What you like and do not like",
            type: "personal",
            skills: ["sentences", "grammar"],
            instructions: "Write sentences about two things you like and one thing you do not like. Use 'I like' and 'I do not like'.",
            example: "I like coffee. I like reading. I do not like cold weather.",
            exampleNote: "Use 'do not' for the negative.",
            tip: "After 'like', use a noun or an -ing word.",
            prompt: "Write about two things you like and one thing you do not like. Say why for one of them.",
            choices: ["Food and drink", "Free time"],
            minWords: 20
          }
        ]
      },
      {
        id: "A1-u3",
        title: "My day",
        topic: "daily-life",
        activities: [
          {
            id: "A1-u3-a1",
            title: "Your morning routine",
            type: "everyday",
            skills: ["sentences", "vocabulary"],
            instructions: "Write four sentences about your morning. Put the actions in order.",
            example: "I wake up at seven. I brush my teeth. I eat breakfast. I go to work.",
            exampleNote: "Use the present simple for things you do every day.",
            tip: "Words like first, then, and after that help show order.",
            prompt: "Write four sentences about your morning routine, in order.",
            choices: ["My morning", "My evening"],
            minWords: 20
          },
          {
            id: "A1-u3-a2",
            title: "Write your daily plan",
            type: "everyday",
            skills: ["vocabulary", "sentences"],
            instructions: "Write a short plan for today. List three things you will do.",
            example: "Today I will clean my room. Then I will buy food. After that I will call my friend.",
            exampleNote: "Use 'I will' to talk about later today.",
            tip: "Use 'then' and 'after that' to connect your plans.",
            prompt: "Write a short plan for today with three things you will do.",
            choices: ["Plans for today", "Plans for this weekend"],
            minWords: 20
          },
          {
            id: "A1-u3-a3",
            title: "Tell someone what you did",
            type: "everyday",
            skills: ["sentences", "grammar"],
            instructions: "Write three sentences about yesterday. Use the past simple.",
            example: "Yesterday I worked. I cooked dinner. I watched a film.",
            exampleNote: "Add -ed to many verbs to talk about the past.",
            tip: "Some verbs are irregular: go becomes went, eat becomes ate.",
            prompt: "Write three sentences about what you did yesterday.",
            choices: ["Yesterday", "Last weekend"],
            minWords: 20
          }
        ]
      },
      {
        id: "A1-u4",
        title: "Short messages",
        topic: "daily-life",
        activities: [
          {
            id: "A1-u4-a1",
            title: "Text a friend",
            type: "message",
            skills: ["sentences", "vocabulary", "punctuation"],
            instructions: "Write a short message to a friend. Say hello and ask one question.",
            example: "Hi Sam. How are you? Do you want to meet on Saturday?",
            exampleNote: "A message can be short, but keep full words.",
            tip: "Use a question mark when you ask something.",
            prompt: "Write a short message to a friend. Say hello and ask one question.",
            choices: ["Make plans", "Say thank you"],
            minWords: 15
          },
          {
            id: "A1-u4-a2",
            title: "Leave a note",
            type: "message",
            skills: ["sentences", "punctuation"],
            instructions: "Write a short note to someone in your home. Say where you are going and when you will be back.",
            example: "Gone to the shop. I will be back at six. Dinner is in the fridge.",
            exampleNote: "A note can skip the greeting and just give the news.",
            tip: "End each sentence with a full stop.",
            prompt: "Write a short note for someone at home about where you are going.",
            choices: ["A note for family", "A note for a roommate"],
            minWords: 15
          },
          {
            id: "A1-u4-a3",
            title: "Reply to an invitation",
            type: "message",
            skills: ["sentences", "grammar"],
            instructions: "Write a short reply to an invitation. Say yes or no and give a short reason.",
            example: "Thank you for the invitation. Yes, I would like to come. What time should I arrive?",
            exampleNote: "Use 'would like' to be polite.",
            tip: "A polite reply often starts with 'thank you'.",
            prompt: "Write a short reply to an invitation. Say yes or no and give a reason.",
            choices: ["A party", "A dinner"],
            minWords: 20
          }
        ]
      }
    ]
  },
  {
    id: "A2",
    cefr: "A2",
    name: "Elementary",
    tagline: "Grow into short, connected writing",
    description: "You will practise writing about people, places, and everyday events. You will write simple stories, messages, and emails with better word choice and basic linking words.",
    ableToWrite: "You will learn to describe people and things in more detail and to write short connected texts. You will be able to write notes, messages, simple stories, and short emails.",
    timeRange: "15-30 minutes a day",
    units: [
      {
        id: "A2-u1",
        title: "Describing things and people",
        topic: "hobbies",
        activities: [
          {
            id: "A2-u1-a1",
            title: "Describe a person",
            type: "description",
            skills: ["vocabulary", "sentences"],
            instructions: "Write four sentences describing a person you know. Say how they look and what they are like.",
            example: "My uncle is tall and has short grey hair. He is very friendly and always laughs. He loves cooking.",
            exampleNote: "Use adjectives after 'is' and before the noun.",
            tip: "Adjectives: tall, short, kind, funny, shy, cheerful.",
            prompt: "Describe a person you know. Say how they look and one thing about their personality.",
            choices: ["A family member", "A friend"],
            minWords: 30
          },
          {
            id: "A2-u1-a2",
            title: "Describe your favourite place",
            type: "description",
            skills: ["vocabulary", "organization"],
            instructions: "Write four sentences about a place you like. Say where it is and what you can see there.",
            example: "My favourite place is the beach near my city. There is soft sand and blue water. Many people swim there.",
            exampleNote: "Use 'there is' and 'there are' to describe a place.",
            tip: "Use words like near, next to, and behind for position.",
            prompt: "Describe a place you like. Say where it is and two things you can see there.",
            choices: ["A place in town", "A place you visited"],
            minWords: 30
          },
          {
            id: "A2-u1-a3",
            title: "Describe an object",
            type: "description",
            skills: ["vocabulary", "grammar"],
            instructions: "Write four sentences about an object you use often. Say what it is, its colour, size, and why you like it.",
            example: "I have a small black notebook. It fits in my bag. I write my ideas in it every day.",
            exampleNote: "Put size and colour before the noun: a small black notebook.",
            tip: "Adjectives go before the noun and do not change form.",
            prompt: "Describe an object you use often. Say its colour, size, and one use.",
            choices: ["Something you use daily", "A gift you received"],
            minWords: 30
          }
        ]
      },
      {
        id: "A2-u2",
        title: "Notes and messages",
        topic: "daily-life",
        activities: [
          {
            id: "A2-u2-a1",
            title: "Write a reminder note",
            type: "message",
            skills: ["sentences", "clarity", "punctuation"],
            instructions: "Write a short note to remind someone of something important. Include the what, the where, and the time.",
            example: "Reminder: dentist appointment on Tuesday at three. Please bring your card.",
            exampleNote: "A reminder should be clear and quick to read.",
            tip: "Put the most important word first.",
            prompt: "Write a note reminding someone about an appointment or event. Include the day and time.",
            choices: ["A doctor appointment", "A class or meeting"],
            minWords: 25
          },
          {
            id: "A2-u2-a2",
            title: "Ask for a small favour",
            type: "message",
            skills: ["tone", "sentences"],
            instructions: "Write a polite message asking a friend for a small favour. Say please and thank you.",
            example: "Could you please pick up my package today? It is at the front desk. Thank you so much.",
            exampleNote: "Use 'could you' and 'please' to be polite.",
            tip: "Adding 'thank you' at the end sounds friendly.",
            prompt: "Write a polite message asking a friend for a small favour.",
            choices: ["Pick something up", "Help with a task"],
            minWords: 25
          },
          {
            id: "A2-u2-a3",
            title: "Make a shopping list note",
            type: "everyday",
            skills: ["vocabulary", "spelling"],
            instructions: "Write a short shopping list grouped by category. Spell each item correctly.",
            example: "Fruit: apples, bananas. Dairy: milk, cheese. Bread: two loaves.",
            exampleNote: "Grouping items makes the list easy to use.",
            tip: "Check the spelling of each item before you finish.",
            prompt: "Write a short shopping list with items grouped into two or three categories.",
            choices: ["Food shopping", "Things for a trip"],
            minWords: 25
          }
        ]
      },
      {
        id: "A2-u3",
        title: "A simple story",
        topic: "hobbies",
        activities: [
          {
            id: "A2-u3-a1",
            title: "Tell a short story",
            type: "story",
            skills: ["sentences", "grammar"],
            instructions: "Write a short story about something that happened to you. Use the past simple and tell events in order.",
            example: "Last Saturday I went to the market. I bought some fruit. Then it started to rain, so I ran home.",
            exampleNote: "Use past verbs and time words like then and after that.",
            tip: "Irregular past verbs: go - went, buy - bought, see - saw.",
            prompt: "Write a short story about something that happened to you. Use the past simple.",
            choices: ["A funny moment", "A surprise"],
            minWords: 30
          },
          {
            id: "A2-u3-a2",
            title: "Write about your weekend",
            type: "story",
            skills: ["organization", "grammar"],
            instructions: "Write five sentences about last weekend. Put the events in the order they happened.",
            example: "On Saturday morning I cleaned the house. In the afternoon I met my cousin. We had dinner together.",
            exampleNote: "Use time words to show the order of events.",
            tip: "Start with the earliest event and move forward.",
            prompt: "Write about your weekend in the past simple, in order.",
            choices: ["Last weekend", "A holiday you remember"],
            minWords: 35
          },
          {
            id: "A2-u3-a3",
            title: "End a story",
            type: "story",
            skills: ["organization", "sentences"],
            instructions: "Write the ending of a short story. Show how the person feels at the end.",
            example: "At last the bus came. I got on and sat down. I felt tired but very happy to be home.",
            exampleNote: "A good ending tells how the person felt.",
            tip: "Use feeling words like happy, tired, proud, or relieved.",
            prompt: "Write a short story ending that shows how the person felt at the end.",
            choices: ["A journey home", "A first day at work"],
            minWords: 30
          }
        ]
      },
      {
        id: "A2-u4",
        title: "My first emails",
        topic: "travel",
        activities: [
          {
            id: "A2-u4-a1",
            title: "Write an email to a friend",
            type: "email",
            skills: ["sentences", "tone"],
            instructions: "Write a short friendly email to a friend. Greet them, share one piece of news, and ask a question.",
            example: "Hi Maria, I hope you are well. I started a new hobby last month. Have you tried anything new?",
            exampleNote: "A friendly email starts with a greeting and ends with a question or wish.",
            tip: "Use 'Hi' or 'Hello' for a friend.",
            prompt: "Write a short friendly email to a friend with one piece of news and one question.",
            choices: ["Tell them about a hobby", "Tell them about a trip"],
            minWords: 30
          },
          {
            id: "A2-u4-a2",
            title: "Email to ask for information",
            type: "email",
            skills: ["sentences", "clarity", "punctuation"],
            instructions: "Write a short email asking for information. Say who you are, what you need, and ask one clear question.",
            example: "Dear Sir or Madam, I am writing to ask about the tour times. Could you tell me when the tours start?",
            exampleNote: "A polite email states the purpose early.",
            tip: "Use 'I am writing to...' to open a formal email.",
            prompt: "Write a short email asking for information about a service or event.",
            choices: ["Ask about a tour", "Ask about a course"],
            minWords: 30
          },
          {
            id: "A2-u4-a3",
            title: "Reply to a travel booking",
            type: "email",
            skills: ["tone", "vocabulary"],
            instructions: "Write a short email confirming a hotel or tour booking. Repeat the date and say thank you.",
            example: "Dear Reservations, thank you for your reply. I would like to confirm my booking for 10 May. Please let me know if you need anything else.",
            exampleNote: "Repeat key facts like dates so nothing is lost.",
            tip: "Confirm means to say yes again clearly.",
            prompt: "Write a short email confirming a booking. Include the date and a polite thank you.",
            choices: ["Confirm a hotel room", "Confirm a tour"],
            minWords: 30
          }
        ]
      }
    ]
  },
  {
    id: "B1",
    cefr: "B1",
    name: "Intermediate",
    tagline: "Build paragraphs and share your view",
    description: "You will build clear paragraphs and write polite messages, simple opinions, and stories. You will practise linking ideas and choosing the right tone for the reader.",
    ableToWrite: "You will learn to write well-organized paragraphs and short texts with a clear purpose. You will be able to express opinions, describe past events, and write polite emails and messages.",
    timeRange: "20-40 minutes a day",
    units: [
      {
        id: "B1-u1",
        title: "Building paragraphs",
        topic: "daily-life",
        activities: [
          {
            id: "B1-u1-a1",
            title: "Write a topic sentence",
            type: "description",
            skills: ["organization", "clarity"],
            instructions: "Write a topic sentence and two supporting sentences about a place you know. Make the topic sentence state the main idea.",
            example: "The market in my town is the busiest place on Saturdays. Stall owners shout their prices, and people crowd around the fresh fruit.",
            exampleNote: "The topic sentence comes first and states the main idea.",
            tip: "Ask yourself: what is the one main idea of this paragraph?",
            prompt: "Write a short paragraph with a topic sentence and two supporting sentences about a place you know.",
            choices: ["A busy place", "A quiet place"],
            minWords: 40
          },
          {
            id: "B1-u1-a2",
            title: "Order your ideas",
            type: "description",
            skills: ["organization", "sentences"],
            instructions: "Write a paragraph describing your daily routine. Use linking words like first, then, and after that.",
            example: "First I check my messages, then I plan my tasks. After that I work on the most important job of the day.",
            exampleNote: "Linking words guide the reader through your ideas.",
            tip: "Use one linking word at the start of each step.",
            prompt: "Write a paragraph describing your routine using at least three linking words.",
            choices: ["My work routine", "My study routine"],
            minWords: 40
          },
          {
            id: "B1-u1-a3",
            title: "Give examples and reasons",
            type: "description",
            skills: ["organization", "vocabulary"],
            instructions: "Write a paragraph about a hobby. Give two reasons why you enjoy it, with one example.",
            example: "I enjoy gardening because it calms me. For example, after a long day I feel relaxed when I water my plants.",
            exampleNote: "Use 'because' for reasons and 'for example' for examples.",
            tip: "Support each claim with a reason or an example.",
            prompt: "Write a paragraph about a hobby with two reasons and one example.",
            choices: ["A hobby you love", "A sport you follow"],
            minWords: 50
          }
        ]
      },
      {
        id: "B1-u2",
        title: "Polite emails and messages",
        topic: "work",
        activities: [
          {
            id: "B1-u2-a1",
            title: "Write a polite request email",
            type: "email",
            skills: ["tone", "sentences"],
            instructions: "Write a polite email to a teacher or manager asking for help. Use a polite opening and a clear request.",
            example: "Dear Ms Lee, I am writing to ask for your help with the report. Could you please check the first section by Friday?",
            exampleNote: "Use 'could you please' to make a polite request.",
            tip: "Always end a request email with a thank you.",
            prompt: "Write a polite email to a teacher or manager asking for help with one task.",
            choices: ["Ask a teacher", "Ask a manager"],
            minWords: 50
          },
          {
            id: "B1-u2-a2",
            title: "Apologise politely",
            type: "email",
            skills: ["tone", "clarity"],
            instructions: "Write a short email apologising for a mistake or a missed meeting. Say sorry, explain briefly, and offer a solution.",
            example: "Dear Mr Chen, I am sorry I missed our meeting yesterday. My train was delayed. Could we meet again on Thursday?",
            exampleNote: "Say sorry first, then explain, then offer a fix.",
            tip: "A brief reason is enough; do not over-explain.",
            prompt: "Write a short email apologising for a mistake or missed meeting, and offer a solution.",
            choices: ["Missed a meeting", "Sent a wrong document"],
            minWords: 50
          },
          {
            id: "B1-u2-a3",
            title: "Send a friendly but clear message",
            type: "message",
            skills: ["tone", "clarity"],
            instructions: "Write a message to a classmate or colleague to share an update. Be friendly but clear about the main point.",
            example: "Hi Tom, quick update: the report is ready and I have shared it with the team. Could you look at page three when you have time?",
            exampleNote: "A good update leads with the main point.",
            tip: "Keep it friendly, but state the key fact early.",
            prompt: "Write a friendly but clear message sharing an update with a classmate or colleague.",
            choices: ["Share a project update", "Share a schedule change"],
            minWords: 40
          }
        ]
      },
      {
        id: "B1-u3",
        title: "Giving your opinion",
        topic: "general",
        activities: [
          {
            id: "B1-u3-a1",
            title: "State your opinion",
            type: "opinion",
            skills: ["organization", "sentences"],
            instructions: "Write a short paragraph stating your opinion on a topic. Start with 'In my opinion' and give two reasons.",
            example: "In my opinion, learning a language is easier with daily practice. Short lessons keep the words fresh, and speaking out loud builds confidence.",
            exampleNote: "State the opinion first, then support it with reasons.",
            tip: "Phrases: In my opinion, I believe, I think.",
            prompt: "Write a short paragraph stating your opinion on a topic, with two reasons.",
            choices: ["The best way to learn", "The best way to relax"],
            minWords: 50
          },
          {
            id: "B1-u3-a2",
            title: "Agree or disagree",
            type: "opinion",
            skills: ["grammar", "clarity"],
            instructions: "Write a paragraph saying whether you agree or disagree with a statement. Give one reason and one example.",
            example: "I disagree that students should not use phones in class. For example, phones can quickly look up words during reading.",
            exampleNote: "Say clearly if you agree or disagree, then support it.",
            tip: "Use 'I agree because' or 'I disagree because'.",
            prompt: "Write a paragraph saying whether you agree or disagree with a statement, with a reason and an example.",
            choices: ["Phones in class", "Working from home"],
            minWords: 50
          },
          {
            id: "B1-u3-a3",
            title: "Compare two options",
            type: "opinion",
            skills: ["vocabulary", "organization"],
            instructions: "Write a paragraph comparing two options and say which you prefer and why.",
            example: "I prefer reading paper books to e-books. Paper feels calmer for my eyes, and I remember the pages better.",
            exampleNote: "Use 'I prefer... to...' and give a reason.",
            tip: "Comparison words: better, more, less, than.",
            prompt: "Write a paragraph comparing two options and say which you prefer, with a reason.",
            choices: ["Books or e-books", "City or countryside"],
            minWords: 50
          }
        ]
      },
      {
        id: "B1-u4",
        title: "Telling what happened",
        topic: "travel",
        activities: [
          {
            id: "B1-u4-a1",
            title: "Write about a trip",
            type: "story",
            skills: ["organization", "vocabulary"],
            instructions: "Write a short account of a trip you took. Describe what you saw and how you felt.",
            example: "Last year I visited a small mountain town. The air was cool and the streets were quiet. I felt relaxed for the first time in months.",
            exampleNote: "Include sights and feelings to bring the story alive.",
            tip: "Use past verbs consistently throughout the story.",
            prompt: "Write a short account of a trip, describing what you saw and how you felt.",
            choices: ["A city trip", "A trip to nature"],
            minWords: 50
          },
          {
            id: "B1-u4-a2",
            title: "Describe an unexpected event",
            type: "story",
            skills: ["grammar", "clarity"],
            instructions: "Write a short story about an unexpected event. Explain what happened and what you did next.",
            example: "Halfway through dinner, the lights went out. We found candles and finished the meal by their soft light. It turned into a lovely evening.",
            exampleNote: "Show the events in order and the result.",
            tip: "Use 'then', 'next', and 'finally' to order events.",
            prompt: "Write a short story about an unexpected event and what happened next.",
            choices: ["A power cut", "A surprise visitor"],
            minWords: 50
          },
          {
            id: "B1-u4-a3",
            title: "Tell what happened and why",
            type: "story",
            skills: ["organization", "grammar"],
            instructions: "Write a paragraph telling what happened and why it mattered to you. Use the past simple and one past continuous verb.",
            example: "I was walking to work when I saw an old friend. We had not met for years, so we stopped and talked for an hour.",
            exampleNote: "Use 'was/were + -ing' for the background action.",
            tip: "Past continuous sets the scene; past simple tells the event.",
            prompt: "Write a paragraph telling what happened and why it mattered, using one past continuous verb.",
            choices: ["A meeting that mattered", "A lesson you learned"],
            minWords: 50
          }
        ]
      }
    ]
  },
  {
    id: "B2",
    cefr: "B2",
    name: "Upper-intermediate",
    tagline: "Link ideas and adapt your tone",
    description: "You will connect ideas smoothly and adapt your tone for formal and informal writing. You will write reviews and balanced arguments.",
    ableToWrite: "You will learn to write well-linked paragraphs, formal and informal texts, reviews, and for-and-against essays. You will be able to express and support opinions with clear, connected arguments.",
    timeRange: "20-40 minutes a day",
    units: [
      {
        id: "B2-u1",
        title: "Linking ideas",
        topic: "education",
        activities: [
          {
            id: "B2-u1-a1",
            title: "Link sentences with connectors",
            type: "essay",
            skills: ["organization", "sentences"],
            instructions: "Write a paragraph linking your ideas with connectors such as however, therefore, and in addition.",
            example: "Studying online saves time; however, it requires strong self-discipline. In addition, learners need a quiet space.",
            exampleNote: "Use connectors to show contrast, result, and addition.",
            tip: "Do not start every sentence with the same connector.",
            prompt: "Write a paragraph using however, therefore, and in addition to link your ideas.",
            choices: ["Online learning", "Public transport"],
            minWords: 70
          },
          {
            id: "B2-u1-a2",
            title: "Build a for-and-against paragraph",
            type: "opinion",
            skills: ["organization", "clarity"],
            instructions: "Write one paragraph presenting two sides of an issue. Use 'on the one hand' and 'on the other hand'.",
            example: "On the one hand, working from home saves commuting time. On the other hand, it can make it harder to separate work from rest.",
            exampleNote: "These phrases clearly mark the two sides.",
            tip: "Give each side equal space and keep the tone balanced.",
            prompt: "Write one paragraph presenting two sides of an issue.",
            choices: ["Working from home", "Social media"],
            minWords: 70
          },
          {
            id: "B2-u1-a3",
            title: "Link a cause and effect",
            type: "essay",
            skills: ["grammar", "organization"],
            instructions: "Write a paragraph explaining a cause and its effect. Use 'as a result' or 'consequently'.",
            example: "The city closed its main road, and as a result, traffic moved to the smaller streets. Consequently, those streets became crowded.",
            exampleNote: "Cause and effect words show how one thing leads to another.",
            tip: "State the cause first, then the result.",
            prompt: "Write a paragraph explaining a cause and its effect, using a result connector.",
            choices: ["A local change", "A new rule"],
            minWords: 70
          }
        ]
      },
      {
        id: "B2-u2",
        title: "Formal and informal tone",
        topic: "work",
        activities: [
          {
            id: "B2-u2-a1",
            title: "Write the same message two ways",
            type: "email",
            skills: ["tone", "vocabulary"],
            instructions: "Write the same request twice: once to a friend and once to a manager. Change the tone for each reader.",
            example: "To a friend: Can you send me the file? To a manager: Could you please send me the file when you have a moment?",
            exampleNote: "Formal writing uses full phrases and polite forms.",
            tip: "Formal: no contractions, use 'could you please'.",
            prompt: "Write the same request twice, once informal and once formal.",
            choices: ["Ask for a file", "Ask for a deadline change"],
            minWords: 70
          },
          {
            id: "B2-u2-a2",
            title: "Rewrite a text more formally",
            type: "work",
            skills: ["tone", "editing"],
            instructions: "Rewrite a casual message as a formal one for work. Replace slang and add a polite opening and closing.",
            example: "Casual: Hey, can we move the call? Formal: Dear team, could we please reschedule the call to a later time? Thank you.",
            exampleNote: "Formal writing avoids slang and uses full sentences.",
            tip: "Use 'Dear' and a closing like 'Kind regards'.",
            prompt: "Rewrite a casual message as a formal one for work, with a polite opening and closing.",
            choices: ["Reschedule a call", "Ask for more time"],
            minWords: 70
          },
          {
            id: "B2-u2-a3",
            title: "Match tone to the reader",
            type: "work",
            skills: ["tone", "clarity"],
            instructions: "Write a short message to a customer or client explaining a delay. Keep it polite, clear, and reassuring.",
            example: "Dear Ms Park, we are sorry for the delay with your order. We expect to send it within two days and will confirm by email.",
            exampleNote: "A customer message should be calm, clear, and helpful.",
            tip: "Lead with the apology or the key fact, not with excuses.",
            prompt: "Write a polite message to a customer or client explaining a delay and what will happen next.",
            choices: ["A delayed order", "A delayed reply"],
            minWords: 70
          }
        ]
      },
      {
        id: "B2-u3",
        title: "Reviews",
        topic: "hobbies",
        activities: [
          {
            id: "B2-u3-a1",
            title: "Review a film or book",
            type: "review",
            skills: ["vocabulary", "organization"],
            instructions: "Write a short review of a film or book. Summarise it, then say what you liked and one thing you did not.",
            example: "The film follows a quiet village doctor. I loved its slow pace and warm characters, though the ending felt a little rushed.",
            exampleNote: "A review has a summary, then an opinion.",
            tip: "Do not spoil the ending in your review.",
            prompt: "Write a short review of a film or book, with a summary and your opinion.",
            choices: ["A film", "A book"],
            minWords: 80
          },
          {
            id: "B2-u3-a2",
            title: "Review a place",
            type: "review",
            skills: ["clarity", "vocabulary"],
            instructions: "Write a review of a restaurant, hotel, or cafe. Describe the place and recommend it or not, with reasons.",
            example: "The cafe is small but bright, with friendly staff and fresh cakes. I recommend the oat latte. Prices are fair for the area.",
            exampleNote: "Give clear reasons for your recommendation.",
            tip: "Use specific details, not just 'it was nice'.",
            prompt: "Write a review of a restaurant, hotel, or cafe with a clear recommendation.",
            choices: ["A restaurant", "A hotel or cafe"],
            minWords: 80
          },
          {
            id: "B2-u3-a3",
            title: "Review a product",
            type: "review",
            skills: ["organization", "clarity"],
            instructions: "Write a product review. Say what the product is, its main good point, one weak point, and who should buy it.",
            example: "These headphones sound clear and block noise well. The ear pads feel a little stiff at first. They suit commuters on a budget.",
            exampleNote: "Include a useful point, a weak point, and a target user.",
            tip: "End with who the product is good for.",
            prompt: "Write a product review covering a good point, a weak point, and the ideal user.",
            choices: ["A gadget", "A kitchen item"],
            minWords: 80
          }
        ]
      },
      {
        id: "B2-u4",
        title: "For and against",
        topic: "general",
        activities: [
          {
            id: "B2-u4-a1",
            title: "Plan a for-and-against essay",
            type: "essay",
            skills: ["organization", "clarity"],
            instructions: "Write the introduction and one paragraph of a for-and-against essay. Present both sides fairly.",
            example: "More people now work from home. Some praise the freedom it gives, while others miss the social side of an office.",
            exampleNote: "The introduction states the topic and both sides.",
            tip: "Keep your own opinion for the conclusion, not the opening.",
            prompt: "Write the introduction and one body paragraph of a for-and-against essay.",
            choices: ["Working from home", "Online exams"],
            minWords: 90
          },
          {
            id: "B2-u4-a2",
            title: "Argue the other side",
            type: "opinion",
            skills: ["organization", "grammar"],
            instructions: "Write a paragraph defending the side you disagree with. Present its strongest point fairly.",
            example: "Some argue that homework teaches independence. Students must manage their own time and solve problems alone, which builds useful habits.",
            exampleNote: "Presenting the other side fairly makes your own argument stronger.",
            tip: "Use phrases like 'some argue' or 'supporters say'.",
            prompt: "Write a paragraph fairly presenting the side you disagree with.",
            choices: ["Homework", "Strict deadlines"],
            minWords: 90
          },
          {
            id: "B2-u4-a3",
            title: "Write a conclusion",
            type: "essay",
            skills: ["clarity", "editing"],
            instructions: "Write the conclusion of a for-and-against essay. Summarise both sides and state your own view with one reason.",
            example: "In conclusion, working from home offers freedom but can feel isolating. On balance, I support a mix of both, as it keeps flexibility and connection.",
            exampleNote: "A conclusion balances the sides and states your view.",
            tip: "Use 'In conclusion' or 'On balance' to begin.",
            prompt: "Write the conclusion of a for-and-against essay, summarising both sides and stating your view.",
            choices: ["A mixed work model", "A balanced rule"],
            minWords: 80
          }
        ]
      }
    ]
  },
  {
    id: "C1",
    cefr: "C1",
    name: "Advanced",
    tagline: "Write with precision and purpose",
    description: "You will write with precision, cutting unnecessary words and choosing the right tone for work and school. You will build persuasive essays and clear reports.",
    ableToWrite: "You will learn to express complex ideas clearly and concisely. You will be able to write persuasive essays, structured reports, and texts with an appropriate professional or academic tone.",
    timeRange: "25-45 minutes a day",
    units: [
      {
        id: "C1-u1",
        title: "Clarity and concision",
        topic: "work",
        activities: [
          {
            id: "C1-u1-a1",
            title: "Cut the extra words",
            type: "essay",
            skills: ["editing", "clarity"],
            instructions: "Write a short paragraph, then rewrite it in fewer words without losing the meaning.",
            example: "Wordy: In order to save money, the company decided that it would reduce costs. Concise: The company cut costs to save money.",
            exampleNote: "Remove empty phrases like 'in order to' and 'it would'.",
            tip: "Read each sentence and ask: which words can I delete?",
            prompt: "Write a short paragraph and then a shorter version with the same meaning.",
            choices: ["A company decision", "A personal change"],
            minWords: 120
          },
          {
            id: "C1-u1-a2",
            title: "Choose the exact word",
            type: "essay",
            skills: ["vocabulary", "clarity"],
            instructions: "Write a paragraph replacing vague words like 'good', 'bad', and 'thing' with precise words.",
            example: "Vague: The meeting was good. Precise: The meeting was productive, and we settled the budget quickly.",
            exampleNote: "Precise words give the reader more information.",
            tip: "Ask: good in what way? Then say exactly that.",
            prompt: "Write a paragraph about a recent event, using precise words instead of vague ones.",
            choices: ["A meeting", "A project result"],
            minWords: 120
          },
          {
            id: "C1-u1-a3",
            title: "One idea per sentence",
            type: "essay",
            skills: ["clarity", "editing"],
            instructions: "Write a paragraph where each sentence holds one main idea. Break up long or crowded sentences.",
            example: "Crowded: The plan is ready and we sent it and we need feedback. Clear: The plan is ready, and we have sent it. We now need your feedback.",
            exampleNote: "One idea per sentence is easier to read.",
            tip: "If a sentence has three 'ands', split it.",
            prompt: "Write a paragraph keeping one main idea per sentence.",
            choices: ["A project update", "An event plan"],
            minWords: 120
          }
        ]
      },
      {
        id: "C1-u2",
        title: "Persuasive essays",
        topic: "general",
        activities: [
          {
            id: "C1-u2-a1",
            title: "Open with a strong thesis",
            type: "essay",
            skills: ["organization", "clarity"],
            instructions: "Write an introduction with a clear thesis statement. State your position and the two points you will make.",
            example: "Remote work should remain common because it increases productivity and improves work-life balance for most employees.",
            exampleNote: "A thesis states your position and the reasons you will develop.",
            tip: "Put your thesis as the last sentence of the introduction.",
            prompt: "Write an introduction with a clear thesis statement for a persuasive essay.",
            choices: ["Remote work", "A plastic bag ban"],
            minWords: 120
          },
          {
            id: "C1-u2-a2",
            title: "Support with evidence",
            type: "essay",
            skills: ["organization", "grammar"],
            instructions: "Write a body paragraph that supports your thesis with one reason, an example, and an explanation.",
            example: "First, remote work saves time. For example, employees avoid a long commute, which gives them more hours to rest and focus.",
            exampleNote: "A strong body paragraph has a point, an example, and a link back to the thesis.",
            tip: "Start each paragraph with a clear topic sentence.",
            prompt: "Write a body paragraph supporting your thesis with a reason, example, and explanation.",
            choices: ["A benefit of remote work", "A benefit of your idea"],
            minWords: 120
          },
          {
            id: "C1-u2-a3",
            title: "Address the counterargument",
            type: "essay",
            skills: ["clarity", "organization"],
            instructions: "Write a paragraph acknowledging the strongest objection to your view, then respond to it.",
            example: "Critics say remote work isolates employees. However, regular online meetings and occasional office days can keep teams connected.",
            exampleNote: "Acknowledge the objection, then answer it with 'however'.",
            tip: "Do not mock the other side; answer it fairly.",
            prompt: "Write a paragraph acknowledging the strongest objection to your view and answering it.",
            choices: ["Remote work", "A rule you support"],
            minWords: 120
          }
        ]
      },
      {
        id: "C1-u3",
        title: "Reports",
        topic: "education",
        activities: [
          {
            id: "C1-u3-a1",
            title: "Write a report introduction",
            type: "report",
            skills: ["organization", "clarity"],
            instructions: "Write the introduction of a short report. State the purpose and scope in one or two sentences.",
            example: "This report examines staff feedback on the new meeting schedule. It covers the survey method, the main findings, and three recommendations.",
            exampleNote: "A report introduction states purpose and what the report covers.",
            tip: "Use 'This report...' to open clearly.",
            prompt: "Write the introduction of a short report, stating its purpose and scope.",
            choices: ["Staff feedback", "A course survey"],
            minWords: 120
          },
          {
            id: "C1-u3-a2",
            title: "Present findings",
            type: "report",
            skills: ["organization", "clarity"],
            instructions: "Write the findings section of a report. Present the results clearly and neutrally, using numbers or categories.",
            example: "Of forty respondents, thirty said the schedule helped them plan better. Ten found the new times too early.",
            exampleNote: "Findings should be factual and neutral.",
            tip: "Use neutral verbs like 'said', 'reported', and 'noted'.",
            prompt: "Write the findings section of a report, presenting results clearly and neutrally.",
            choices: ["A survey result", "A project review"],
            minWords: 130
          },
          {
            id: "C1-u3-a3",
            title: "Write recommendations",
            type: "report",
            skills: ["clarity", "tone"],
            instructions: "Write the recommendations section of a report. Offer two or three clear, practical actions.",
            example: "We recommend keeping the current schedule and offering an optional later start one day a week. A short follow-up survey should run in three months.",
            exampleNote: "Recommendations should be concrete and actionable.",
            tip: "Start each recommendation with a clear verb like 'keep', 'offer', or 'run'.",
            prompt: "Write the recommendations section of a report with two or three clear actions.",
            choices: ["Improve a process", "Improve a course"],
            minWords: 120
          }
        ]
      },
      {
        id: "C1-u4",
        title: "Tone for work and school",
        topic: "work",
        activities: [
          {
            id: "C1-u4-a1",
            title: "Adjust tone for the audience",
            type: "work",
            skills: ["tone", "editing"],
            instructions: "Write the same point for two audiences: a senior manager and a new colleague. Adjust formality and detail.",
            example: "To a manager: I recommend we extend the deadline. To a colleague: Let's ask for more time, and I'll update the plan.",
            exampleNote: "Senior readers want a concise proposal; peers want practical next steps.",
            tip: "Match your word choice and length to the reader.",
            prompt: "Write the same point twice, for a senior manager and for a colleague.",
            choices: ["Extend a deadline", "Change a process"],
            minWords: 120
          },
          {
            id: "C1-u4-a2",
            title: "Write an academic-style paragraph",
            type: "school",
            skills: ["tone", "organization"],
            instructions: "Write a paragraph in an academic style. Use formal language, a clear topic sentence, and one citation-style phrase.",
            example: "Research suggests that short, regular study sessions improve retention. One study found that spaced practice doubled recall after a week.",
            exampleNote: "Academic writing is formal, precise, and evidence-based.",
            tip: "Use phrases like 'research suggests' and 'studies show'.",
            prompt: "Write an academic-style paragraph with formal language and evidence.",
            choices: ["Study habits", "The effect of exercise"],
            minWords: 130
          },
          {
            id: "C1-u4-a3",
            title: "Soften a difficult message",
            type: "work",
            skills: ["tone", "clarity"],
            instructions: "Write a message delivering bad news at work in a firm but respectful way. Be clear, brief, and offer a next step.",
            example: "After careful review, we have decided not to continue this project. We appreciate your work and would like to discuss next steps this week.",
            exampleNote: "Deliver the news clearly, then show respect and a way forward.",
            tip: "Avoid blame; focus on the decision and the next step.",
            prompt: "Write a message delivering difficult news clearly and respectfully, with a next step.",
            choices: ["Ending a project", "Declining a proposal"],
            minWords: 120
          }
        ]
      }
    ]
  },
  {
    id: "C2",
    cefr: "C2",
    name: "Proficient",
    tagline: "Master complex, refined writing",
    description: "You will master complex arguments, academic style, and professional writing. You will refine your editing to produce precise, fluent, and sophisticated texts.",
    ableToWrite: "You will learn to construct sophisticated arguments, write academic and professional texts, and edit your own work to a high standard. You will be able to handle a wide range of demanding writing tasks with precision and control.",
    timeRange: "30-60 minutes a day",
    units: [
      {
        id: "C2-u1",
        title: "Complex arguments",
        topic: "general",
        activities: [
          {
            id: "C2-u1-a1",
            title: "Build a layered argument",
            type: "essay",
            skills: ["organization", "clarity"],
            instructions: "Write an essay paragraph that develops one idea through a claim, a qualification, and an example.",
            example: "While remote work boosts flexibility, its benefits are uneven. For instance, roles that need teamwork lose more than they gain from distance.",
            exampleNote: "A layered argument states a claim, qualifies it, and illustrates it.",
            tip: "Use 'while' and 'though' to add nuance.",
            prompt: "Write an essay paragraph that develops one idea through a claim, a qualification, and an example.",
            choices: ["The future of work", "The role of technology"],
            minWords: 150
          },
          {
            id: "C2-u1-a2",
            title: "Use concession and rebuttal",
            type: "essay",
            skills: ["organization", "grammar"],
            instructions: "Write a paragraph that concedes a point to the other side, then rebuts it with a stronger argument.",
            example: "Admittedly, social media connects people across borders. Yet this connection is often shallow and rarely replaces face-to-face trust.",
            exampleNote: "Concede with 'admittedly' or 'granted', then rebut with 'yet'.",
            tip: "A concession makes your rebuttal more persuasive.",
            prompt: "Write a paragraph that concedes a point and then rebuts it.",
            choices: ["Social media", "Automation"],
            minWords: 150
          },
          {
            id: "C2-u1-a3",
            title: "Synthesise opposing views",
            type: "essay",
            skills: ["clarity", "organization"],
            instructions: "Write a paragraph that brings two opposing views together into a balanced synthesis.",
            example: "Both sides hold part of the truth: technology can distract, but it can also focus learning when guided well. The key is purposeful use.",
            exampleNote: "A synthesis finds common ground and states a wider truth.",
            tip: "Use 'both', 'neither', and 'the key is' to unify views.",
            prompt: "Write a paragraph synthesising two opposing views into a balanced conclusion.",
            choices: ["Technology in education", "Regulation and freedom"],
            minWords: 150
          }
        ]
      },
      {
        id: "C2-u2",
        title: "Academic writing",
        topic: "education",
        activities: [
          {
            id: "C2-u2-a1",
            title: "Write a formal academic paragraph",
            type: "essay",
            skills: ["tone", "vocabulary"],
            instructions: "Write a formal academic paragraph with a clear topic sentence, hedging language, and a cited claim.",
            example: "It appears that regular formative feedback correlates with improved student outcomes. A recent study reported gains of up to fifteen percent in final grades.",
            exampleNote: "Hedging words like 'appears' and 'correlates' keep claims careful.",
            tip: "Avoid absolute words like 'always' or 'never' in academic writing.",
            prompt: "Write a formal academic paragraph with a topic sentence, hedging, and a cited claim.",
            choices: ["Feedback in education", "Class size"],
            minWords: 150
          },
          {
            id: "C2-u2-a2",
            title: "Write an abstract-style summary",
            type: "essay",
            skills: ["clarity", "editing"],
            instructions: "Write a short abstract summarising a study or article: purpose, method, and main finding.",
            example: "This paper examines the link between sleep and memory. Using a survey of two hundred students, it finds that consistent sleep predicts better recall.",
            exampleNote: "An abstract covers purpose, method, and result in few words.",
            tip: "Write the abstract after the main text, and keep it under one hundred words.",
            prompt: "Write a short abstract covering purpose, method, and main finding.",
            choices: ["A study on sleep", "A study on reading habits"],
            minWords: 150
          },
          {
            id: "C2-u2-a3",
            title: "Use precise academic verbs",
            type: "essay",
            skills: ["vocabulary", "tone"],
            instructions: "Write a paragraph about research using precise verbs like 'demonstrate', 'indicate', and 'suggest' correctly.",
            example: "The data indicate a modest link between exercise and focus. Earlier work suggested a stronger effect, but the newer sample was more diverse.",
            exampleNote: "Different verbs signal different levels of certainty.",
            tip: "'Suggests' is weaker than 'demonstrates'; choose carefully.",
            prompt: "Write a paragraph about research using precise academic verbs.",
            choices: ["Exercise and focus", "Reading and vocabulary"],
            minWords: 150
          }
        ]
      },
      {
        id: "C2-u3",
        title: "Professional writing",
        topic: "work",
        activities: [
          {
            id: "C2-u3-a1",
            title: "Write an executive summary",
            type: "report",
            skills: ["clarity", "organization"],
            instructions: "Write an executive summary of a report: state the purpose, key finding, and recommendation in a few sentences.",
            example: "This report reviews our customer service workflow. It finds that response times have doubled and recommends a two-person team for peak hours.",
            exampleNote: "An executive summary gives the whole picture in brief.",
            tip: "A busy reader should understand everything from the summary alone.",
            prompt: "Write an executive summary with a purpose, key finding, and recommendation.",
            choices: ["Customer service", "A product launch review"],
            minWords: 150
          },
          {
            id: "C2-u3-a2",
            title: "Write a formal proposal",
            type: "report",
            skills: ["tone", "organization"],
            instructions: "Write the opening of a formal proposal: describe the problem, your proposed solution, and its main benefit.",
            example: "The team currently spends four hours weekly on manual reporting. We propose automating these reports, which would free roughly two hundred staff hours each year.",
            exampleNote: "A proposal states a problem, a solution, and a benefit.",
            tip: "Quantify the benefit where possible.",
            prompt: "Write the opening of a formal proposal with a problem, solution, and benefit.",
            choices: ["Automate a task", "Improve onboarding"],
            minWords: 150
          },
          {
            id: "C2-u3-a3",
            title: "Write meeting minutes",
            type: "report",
            skills: ["clarity", "editing"],
            instructions: "Write a short set of meeting minutes: record the decisions made, the actions agreed, and who owns each action.",
            example: "Decisions: the launch moves to 2 June. Actions: Priya will update the site by 25 May; Sam will brief the support team by 28 May.",
            exampleNote: "Minutes record decisions and actions, not every comment.",
            tip: "Use names and dates so actions are clear and trackable.",
            prompt: "Write short meeting minutes with decisions, actions, and owners.",
            choices: ["A launch meeting", "A planning meeting"],
            minWords: 150
          }
        ]
      },
      {
        id: "C2-u4",
        title: "Editing and style",
        topic: "general",
        activities: [
          {
            id: "C2-u4-a1",
            title: "Edit for concision",
            type: "essay",
            skills: ["editing", "clarity"],
            instructions: "Write a paragraph, then edit it to remove repetition and wordiness while keeping the meaning and voice.",
            example: "Draft: It is my opinion that the plan will in fact work well. Edit: I believe the plan will work well.",
            exampleNote: "Cut filler phrases and repeated words.",
            tip: "Read aloud; anything that drags should be cut.",
            prompt: "Write a paragraph and then a tightened, edited version.",
            choices: ["A plan you support", "A lesson learned"],
            minWords: 180
          },
          {
            id: "C2-u4-a2",
            title: "Fix style and consistency",
            type: "essay",
            skills: ["editing", "tone"],
            instructions: "Write a short text, then check it for consistent tone, tense, and terminology. Fix any drift.",
            example: "Drift: The report says staff are happy, but we felt they were tired. Fixed: The report says staff are satisfied, though some felt tired.",
            exampleNote: "Keep one tense, tone, and term set throughout.",
            tip: "Check the first and last sentence for the same voice.",
            prompt: "Write a short text and then a version with consistent tone, tense, and terms.",
            choices: ["A summary of a meeting", "A short review"],
            minWords: 180
          },
          {
            id: "C2-u4-a3",
            title: "Polish a final draft",
            type: "essay",
            skills: ["editing", "clarity"],
            instructions: "Write a final draft on a topic you care about. Polish the word choice, flow, and rhythm until it reads smoothly.",
            example: "Before: The plan is good and it will help us and save time. After: The plan is effective; it will save us time and effort.",
            exampleNote: "Polishing improves word choice, flow, and rhythm.",
            tip: "Vary sentence length to keep the reader engaged.",
            prompt: "Write a polished final draft on a topic you care about, paying attention to flow and word choice.",
            choices: ["A change you want to see", "A habit worth keeping"],
            minWords: 200
          }
        ]
      }
    ]
  }
];

export const REVIEWS = {
  "A1": {
    title: "Level A1 review",
    intro: "You have worked hard; now show what you can write.",
    tasks: [
      { id: "A1-r1", instructions: "Write three sentences about your daily routine.", prompt: "Write three sentences about what you do every day, in order.", type: "everyday", minWords: 30 },
      { id: "A1-r2", instructions: "Describe your home in a few sentences.", prompt: "Write three or four sentences describing your home and one thing you like about it.", type: "description", minWords: 30 },
      { id: "A1-r3", instructions: "Write a short message to a friend.", prompt: "Write a short message to a friend to make plans for the weekend.", type: "message", minWords: 30 }
    ]
  },
  "A2": {
    title: "Level A2 review",
    intro: "Put together everything you have learned at this level.",
    tasks: [
      { id: "A2-r1", instructions: "Describe a person you know in detail.", prompt: "Describe a person you know: how they look, what they are like, and one thing they enjoy.", type: "description", minWords: 40 },
      { id: "A2-r2", instructions: "Write a polite note asking for a small favour.", prompt: "Write a polite note to a friend asking them to pick up something for you.", type: "message", minWords: 35 },
      { id: "A2-r3", instructions: "Write a short story about last weekend.", prompt: "Write a short story about what you did last weekend, using the past simple in order.", type: "story", minWords: 40 },
      { id: "A2-r4", instructions: "Write a short email to a friend.", prompt: "Write a short friendly email to a friend sharing one piece of news and asking a question.", type: "email", minWords: 40 }
    ]
  },
  "B1": {
    title: "Level B1 review",
    intro: "Show how you can build paragraphs and choose the right tone.",
    tasks: [
      { id: "B1-r1", instructions: "Write a polite request email.", prompt: "Write a polite email to a teacher or manager asking for help with one task, with a clear request and a thank you.", type: "email", minWords: 60 },
      { id: "B1-r2", instructions: "State your opinion with reasons.", prompt: "Write a paragraph stating your opinion on a topic, with two reasons and one example.", type: "opinion", minWords: 60 },
      { id: "B1-r3", instructions: "Tell what happened on a trip.", prompt: "Write a short account of a trip, describing what you saw and how you felt.", type: "story", minWords: 60 },
      { id: "B1-r4", instructions: "Share an update clearly.", prompt: "Write a friendly but clear message sharing an update with a classmate or colleague.", type: "message", minWords: 50 }
    ]
  },
  "B2": {
    title: "Level B2 review",
    intro: "Connect your ideas and adapt your tone with confidence.",
    tasks: [
      { id: "B2-r1", instructions: "Write a for-and-against paragraph.", prompt: "Write one paragraph presenting two sides of an issue using 'on the one hand' and 'on the other hand'.", type: "opinion", minWords: 90 },
      { id: "B2-r2", instructions: "Write a review.", prompt: "Write a review of a film, book, or place, with a summary, your opinion, and a clear recommendation.", type: "review", minWords: 90 },
      { id: "B2-r3", instructions: "Write a formal request email.", prompt: "Write a formal email making a polite request, with a clear opening and closing.", type: "email", minWords: 90 },
      { id: "B2-r4", instructions: "Link ideas in a paragraph.", prompt: "Write a paragraph using however, therefore, and in addition to link your ideas on a topic.", type: "essay", minWords: 90 }
    ]
  },
  "C1": {
    title: "Level C1 review",
    intro: "Demonstrate precision, structure, and a professional tone.",
    tasks: [
      { id: "C1-r1", instructions: "Write a persuasive essay paragraph.", prompt: "Write an introduction with a clear thesis statement for a persuasive essay on a topic you choose.", type: "essay", minWords: 140 },
      { id: "C1-r2", instructions: "Write report findings and recommendations.", prompt: "Write the findings and recommendations sections of a short report, presenting results neutrally and offering clear actions.", type: "report", minWords: 140 },
      { id: "C1-r3", instructions: "Deliver difficult news respectfully.", prompt: "Write a message delivering difficult news at work clearly and respectfully, with a next step.", type: "work", minWords: 140 },
      { id: "C1-r4", instructions: "Rewrite a paragraph more concisely.", prompt: "Write a short paragraph and then a concise rewrite that keeps the meaning while cutting filler words.", type: "essay", minWords: 140 }
    ]
  },
  "C2": {
    title: "Level C2 review",
    intro: "Show mastery of complex, refined writing and editing.",
    tasks: [
      { id: "C2-r1", instructions: "Write a complex argument paragraph.", prompt: "Write an essay paragraph that develops one idea through a claim, a qualification, and an example.", type: "essay", minWords: 180 },
      { id: "C2-r2", instructions: "Write an academic paragraph.", prompt: "Write a formal academic paragraph with a topic sentence, hedging language, and a cited claim.", type: "essay", minWords: 180 },
      { id: "C2-r3", instructions: "Write an executive summary.", prompt: "Write an executive summary stating a purpose, key finding, and recommendation in a few sentences.", type: "report", minWords: 180 },
      { id: "C2-r4", instructions: "Edit and polish a draft.", prompt: "Write a paragraph and then a polished version with improved word choice, flow, and consistency.", type: "essay", minWords: 180 }
    ]
  }
};

export const PLACEMENT_QUESTIONS = [
  { id: "p1", question: "Can you write simple sentences about yourself, such as your name and where you live?" },
  { id: "p2", question: "Can you describe people, places, and things with a few short sentences?" },
  { id: "p3", question: "Can you write short messages and notes to friends or family?" },
  { id: "p4", question: "Can you write a simple email to ask for information or share news?" },
  { id: "p5", question: "Can you state your opinion and give a reason for it?" },
  { id: "p6", question: "Can you organize a paragraph with a clear topic sentence and supporting ideas?" },
  { id: "p7", question: "Can you tell a story about something that happened in the past?" },
  { id: "p8", question: "Can you write a longer essay with an introduction, body, and conclusion?" }
];

export function getLevel(id) {
  return LEVELS.find((l) => l.id === id) || null;
}
export function getActivity(id) {
  for (const l of LEVELS) {
    for (const u of l.units) {
      const a = u.activities.find((x) => x.id === id);
      if (a) return { level: l, unit: u, activity: a };
    }
  }
  return null;
}
export function allActivities() {
  const out = [];
  for (const l of LEVELS) for (const u of l.units) for (const a of u.activities) {
    out.push({ level: l, unit: u, activity: a });
  }
  return out;
}
