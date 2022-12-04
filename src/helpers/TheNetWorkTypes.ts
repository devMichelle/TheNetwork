export type ProfileType = {
  name: string;
  email: string;
  banner: string;
  avatar: string;
  _count: {
    posts: Number;
    followers: Number;
    following: Number;
  };
};

export type userProfileData = {
  author: { name: string; email: string; avatar: string; banner: string };
  comments: [
    {
      body: string;
      owner: string;
      replyToId: null | number;
      id: number;
      postId: number;
      author: { name: string; email: string; avatar: string; banner: string };
    }
  ];
  id: number;
  title: string;
  body: String;
  media: string;

  reactions: [
    { symbol: string; count: number; postId: number; message: string }
  ];
};

export type profilePostType = {
  body: string;
  title: string;
  media: string;
  _count: {
    comments: Number;
    reaction: number;
  };
};


export type profileFollowers = {
    followers: {
        name:string,
        avatar:string
    }
}