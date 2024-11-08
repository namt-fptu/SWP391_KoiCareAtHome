import Header from "../../component/header";
import Footer from "../../component/footer";
// import VipPackage from "../../component/vipPackage";
import { Button, Row, Col, Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import landing1 from "../../assets/landing 1.png";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const storageImg = getStorage(app);
const storageTxt = getStorage(app);

const { Title, Paragraph, Text } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [value, setValue] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get(`Adv/getAdvById/${id}`);
        const postsData = response.data;

        // Tải nội dung từ Firebase cho từng bài viết
        const postsWithContent = await Promise.all(
          postsData.map(async (post) => {
            if (post.url) {
              try {
                const contentURL = await getDownloadURL(
                  ref(storageTxt, post.url)
                );
                const contentResponse = await fetch(contentURL);
                const contentText = await contentResponse.text();
                return { ...post, content: contentText }; // Cập nhật content vào post
              } catch (error) {
                console.error("Failed to fetch content from Firebase", error);
                console.log(post.url);
                return { ...post, content: "Content could not be loaded" }; // Trường hợp lỗi
              }
            }
            return post;
          })
        );

        setPosts(postsWithContent);
      } catch (error) {
        message.error("Failed to load posts. Please add a new post!!");
      }
    };

    fetchPosts();
  }, [id]);

  return (
    <div className="home bg-gray-950 text-slate-50">
      <Header />

      <Footer />
    </div>
  );
};

export default Home;
