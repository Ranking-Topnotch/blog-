// import React, { useEffect, useState, useRef } from "react";
// import style from './blog.module.css';
// import Avatar from '../../assest/noavatar.png';
// import { Link } from "react-router-dom";

// const Blog = ({ member }) => {
//   const [blogs, setBlogs] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const observer = useRef();

//   useEffect(() => {
//     const fetchData = async () => {
//       const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/getblogs`);
//       const resData = await res.json();
//       setBlogs(resData);
//       setIsLoading(false);
//     };

//     fetchData();

//     // Cleanup
//     return () => {
//       if (observer.current) {
//         observer.current.disconnect();
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (!isLoading && blogs.length > 0) {
//       const options = {
//         root: null,
//         rootMargin: "0px",
//         threshold: 0.1 // Trigger when 10% of the item is visible
//       };

//       const handleIntersection = (entries) => {
//         entries.forEach(entry => {
//           if (entry.isIntersecting) {
//             // Load more data or perform other actions when item is intersecting
//             console.log("Item is intersecting:", entry.target);
//           }
//         });
//       };

//       observer.current = new IntersectionObserver(handleIntersection, options);
//       const targets = document.querySelectorAll('.blogcon');
//       targets.forEach(target => observer.current.observe(target));

//       return () => {
//         observer.current.disconnect();
//       };
//     }
//   }, [isLoading, blogs]);

//   return (
//     <div className={style.blogcontain}>
//       {isLoading ? (
//         <p>Loading...</p>
//       ) : (
//         blogs.map((e, index) => (
//           <div className={style.blogcon} key={e._id} id={`blog-${index}`}>
//             <div className={style.imgcon}>
//                <img src={e.img} alt="blogpage" height={200} width={200} />
//            </div>
//            <div className={style.blog}>
//                <div className={style.usercon}>
//                  <Link to={`/${e.username}`} ><img className={style.user} src={ e.profile ? e.profile : Avatar } alt="blogpage" height={20} width={20} /> </Link>
//                  <Link to={`/${e.username}`} ><p className={style.username}>{e.username}</p></Link>
//                </div>
//                <h1 className={style.head}>{e.title}</h1>
//                <p className={style.date}>{e.createdAt}</p>
//                <p className={style.body}>{e.body}</p>
//                <Link to={`/blog/${e._id}`} className={style.link}>Read more</Link>
//              </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default Blog;






import React, { useEffect, useState } from "react"
import style from './blog.module.css'
import Avatar from '../../assest/noavatar.png'
import { Link } from "react-router-dom"

const Blog = ({ member }) => {
  const [ blogs, setBlogs ] = useState('')
  const [ isLoading, setIsLoading ] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/getblogs`);
      const resData = await res.json();
      setBlogs(resData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if(blogs.length === 0){
    return <p className={style.no_blog}>No blog yet. Be the first to post.</p>
  }
  
  return (
    <div className={style.blogcontain}>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        blogs.map((e) => (
          <div className={style.blogcon} key={e._id}>
            { e.img && <div className={style.imgcon}>
              <img src={e.img} alt="" height={200} width={200} />
            </div>}
            <div className={style.blog}>
              <div className={style.usercon}>
                <Link to={`/${e.username}`} ><img className={style.user} src={ e.profile ? e.profile : Avatar } alt="" height={20} width={20} /> </Link>
                <Link to={`/${e.username}`} ><p className={style.username}>{e.username}</p></Link>
              </div>
              <h1 className={style.head}>{e.title}</h1>
              <p className={style.date}>{e.createdAt.split("T")[0] + " " + e.createdAt.split("T")[1].split(".")[0]}</p>
              <p className={style.body}>{e.body}</p>
              <Link to={`/blog/${e._id}`} className={style.link}>Read more</Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Blog