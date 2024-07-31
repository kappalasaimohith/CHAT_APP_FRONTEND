const sampleRooms = [
    { id: 1, name: 'General' },
    { id: 2, name: 'Technology' },
    { id: 3, name: 'Random' },
  ];
  
  const sampleMessages = {
    1: [
      { id: 1, sender: 'User1', text: 'Hello, everyone!', timestamp: new Date().toLocaleTimeString() },
      { id: 2, sender: 'You', text: 'Hi User1!', timestamp: new Date().toLocaleTimeString() },
    ],
    2: [
      { id: 3, sender: 'User2', text: 'What’s the latest in tech?', timestamp: new Date().toLocaleTimeString() },
      { id: 4, sender: 'You', text: 'Just read about the new tech conference.', timestamp: new Date().toLocaleTimeString() },
    ],
    3: [
      { id: 5, sender: 'User3', text: 'Anyone up for a game tonight?', timestamp: new Date().toLocaleTimeString() },
      { id: 6, sender: 'You', text: 'Sure, I’m in!', timestamp: new Date().toLocaleTimeString() },
    ],
  };

  
export {sampleMessages,sampleRooms};