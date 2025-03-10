const commentData = [
  {
    profile_picture: "https://images.unsplash.com/photo-1741334632363-58022899ce91?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    user_name: "書籍愛好者",
    rate: 5,
    content: "這個平台的文章內容非常多元且深入，每篇都讓我獲得了新的啟發，推薦給愛讀書的朋友！"
  },
  {
    profile_picture: "https://images.unsplash.com/photo-1724452588657-9ab0f8865a2e?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    user_name: "科技愛好者",
    rate: 4,
    content: "文章內容不僅技術性強，而且表達清晰易懂，讓我對最新科技趨勢有了更深的理解。"
  },
  {
    profile_picture: "https://images.unsplash.com/photo-1724376682600-6540c4570ac8?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    user_name: "文章愛好者",
    rate: 5,
    content: "這裡的文章總是能夠觸及到各種有趣的話題，每一篇都值得仔細閱讀！"
  },
  {
    profile_picture:"https://images.unsplash.com/photo-1728519616666-d092572850f9?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    user_name: "新手讀者",
    rate: 4,
    content: "這個平台提供了很多精彩的文章，對我這個剛開始閱讀的朋友來說非常有幫助！"
  },
  {
    profile_picture:"https://images.unsplash.com/photo-1735615479436-6a697c3e0d48?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    user_name: "文化探索者",
    rate: 5,
    content: "每篇文章都充滿深度與思想性，讓我在忙碌中也能停下來反思人生，十分推薦！"
  },
  {
    profile_picture:"https://images.unsplash.com/photo-1737063668547-6c908bbc9858?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    user_name: "創意思考者",
    rate: 5,
    content: "這些文章真的是超有啟發性！不管是關於生活還是創意，總是能給我帶來新的視野。"
  },
  {
    profile_picture:"https://plus.unsplash.com/premium_photo-1732799397450-31d8b8739d8e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    user_name: "冒險家",
    rate: 5,
    content: "這些文章總是能帶領我進入全新的世界，閱讀後讓我對生活充滿更多探索的動力！"
  },
  {
    profile_picture:"https://images.unsplash.com/photo-1737044263770-9ddf6c5654c4?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    user_name: "電影迷",
    rate: 4,
    content: "這裡的文章讓我學到了很多電影背後的故事和細節，讓我更加喜愛每一部電影！"
  },
  {
    profile_picture:"https://plus.unsplash.com/premium_photo-1741161089574-dfbe07c1dc55?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    user_name: "旅行探索者",
    rate: 5,
    content: "我很喜歡這個平台的旅行文章，從每篇文章中都能找到不一樣的旅行靈感，讓我更想出發！"
  },
  {
    profile_picture:"https://plus.unsplash.com/premium_photo-1740683564461-839cf7c86074?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    user_name: "時尚達人",
    rate: 5,
    content: "這裡的時尚文章很棒，每次閱讀後我總能從中得到新穎的靈感，讓我與時俱進！"
  },
  {
    profile_picture:"https://images.unsplash.com/photo-1740507619572-ac180ca2630f?q=80&w=2087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    user_name: "自然愛好者",
    rate: 5,
    content: "這些自然主題的文章讓我更了解自然界的奇妙，文字深入淺出，讓我每次閱讀都收穫良多。"
  },
  {
    profile_picture:"https://images.unsplash.com/photo-1741097574041-d70d3fe6a3ab?q=80&w=1856&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    user_name: "藝術愛好者",
    rate: 4,
    content: "這個平台提供了很多藝術類文章，內容詳盡且充滿創意，每篇都讓我有所收穫。"
  },
  {
    profile_picture:"https://images.unsplash.com/photo-1741091742846-99cca6f6437b?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    user_name: "設計愛好者",
    rate: 5,
    content: "這個平台的設計文章真的是太精彩了，從中我學到了不少設計靈感，值得推薦！"
  },
  {
    profile_picture:"https://plus.unsplash.com/premium_photo-1741194732641-eca20483c388?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    user_name: "料理達人",
    rate: 5,
    content: "這裡有很多關於烹飪的文章，讓我學到不少技巧，每次做菜都能更得心應手！"
  },
  {
    profile_picture:"https://images.unsplash.com/photo-1741192223245-46cbbe8ae332?q=80&w=2065&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    user_name: "創業家",
    rate: 4,
    content: "這個平台的商業類文章內容豐富，讓我在創業過程中有很多啟發，對我幫助很大。"
  },
  {
    profile_picture:"https://images.unsplash.com/photo-1741412252445-afc4139099eb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    user_name: "健身達人",
    rate: 5,
    content: "這裡有很多健康與健身的文章，內容不僅有用，還能激勵我保持健康的生活方式！"
  },
  {
    profile_picture:"https://images.unsplash.com/photo-1741016825495-1faf2afc19d6?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    user_name: "生活專家",
    rate: 5,
    content: "這個平台的文章真的是非常實用，很多生活小技巧讓我受益匪淺，內容又有趣！"
  }
];

export default commentData;
