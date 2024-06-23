import React, { useState, useEffect, useRef } from 'react';
import style from './nav.module.css'
import { FaUserNurse } from "react-icons/fa6";
import { AiOutlineAlignLeft } from 'react-icons/ai'
import { FaTimes } from 'react-icons/fa'
import { Link } from 'react-router-dom';
import Logo from '../../assest/favicon.jpg'

const links = [
    {
        name: "Home",
        path: "/"
    },
    {
        name: "Blog",
        path: "/blog"
    },
    {
        name: "Contact",
        path: "/contact"
    }
]

const Nav = ({ member }) => {
    const [ onMouse, setOnMouse ] = useState(false)
    const [nav, setNav] = useState(true)
    const dropdownRef = useRef(null);
    const navRef = useRef(null);

  const navFlip = () => {
    setNav(prev => !prev)
  }

    const handleMouse = () => {
        setOnMouse(prev => !prev )    
    }
   
    const logout = () => {
        window.open(`${process.env.REACT_APP_SERVER_DOMAIN}/auth/logout`, "_self")
    }

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setOnMouse(false);
        }
        if (navRef.current && !navRef.current.contains(event.target)) {
            setNav(true);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

  return (
    <div className={style.container}>
        <img src={Logo} alt='logo' height={50} width={50}/>

        <div>
        <nav ref={navRef} className={nav ? style.navbar_con_o : style.navbar_con_c}>
            <div className={style.navigation}>
                <AiOutlineAlignLeft onClick={navFlip} className={nav ? style.navbar : style.open}/>
                <FaTimes onClick={navFlip} className={nav ? style.closed : style.navbar}/> 
            </div>
            <ul className={nav ? style.navbar_open : style.navbar_closed}>

                { links.map(link => {
                    return <Link to={link.path} key={link.path} className={style.link}>{link.name}</Link>
                })}

                <div ref={dropdownRef} className={style.logincon}>
                    <div onClick={handleMouse} className={style.link}>
                        <FaUserNurse />
                    </div> 

                    { onMouse && (
                        <div className={style.dropdown}>
                            <div className={style.dropdown_con}>
                                { member === false && <Link to={'/login'}><div onClick={handleMouse} className={style.login}>Login</div></Link>}
                                { member && <Link to={`/${member.username}`}><div onClick={handleMouse} className={style.login}>Profile</div></Link>}
                                { member && <Link to={'/newblog'}><div onClick={handleMouse} className={style.login}>New blog</div></Link>}
                                { member && <div onClick={logout} className={style.login}>Logout</div>}
                            </div> 
                        </div>
                    )}
                </div>
            </ul>
        </nav>
        </div>
    </div>
  )
}

export default Nav