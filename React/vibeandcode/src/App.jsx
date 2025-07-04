import { useState } from "react";

const Message = ({ text, author }) => (
  <div>
    <p>{text}</p>
    <small>- {author}</small>
  </div>
);

const Counter = ({ initialCount }) => {
  const [count, setCount] = useState(initialCount);
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
};

const LikeButton = ({ onLike }) => <button onClick={onLike}>Like</button>;

const UserCard = ({ name, email, imageUrl }) => (
  <div>
    <img src={imageUrl} alt={name} />
    <h3>{name}</h3>
    <p>{email}</p>
  </div>
);

const ThemeBox = ({ isDarkMode }) => (
  <div>
    <p>{isDarkMode ? "Dark Mode" : "Light Mode"}</p>
  </div>
);

function App() {
  const [likes, setLikes] = useState(0);

  return (
    <div>
      <Message text="Hello there!" author="Dennis" />
      <Counter initialCount={0} />
      <p>Likes: {likes}</p>
      <LikeButton onLike={() => setLikes(likes + 1)} />
      <UserCard
        name="DenniS Saitabau"
        email="dennisntete28@gmail.com"
        imageUrl="https://lh3.googleusercontent.com/a/ALm5wu0ILbMoRwlQI7cnmyMDKfcItcIipdJ0hwwXN1J5QQ=s96-c"
      />
      <ThemeBox isDarkMode={true} />
    </div>
  );
}

export default App;
