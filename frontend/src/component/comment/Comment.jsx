import React from 'react'
import style from './comment.module.css'
import Avatar from '../../assest/noavatar.png'
import { MdDeleteOutline } from "react-icons/md"

const Comment = ({ comment, deleteComment }) => {

  return (
    <div className={style.comment_con}>
      {comment.length === 0 ? (
        <p className={style.checkedComment}>No comments yet. Be the first to comment.</p>
      ) : (
        comment.map((e) => (
          <div key={e._id} className={style.usercon}>
            <div>
              <img className={style.user} src={Avatar} alt="User Avatar" height={40} width={40} />
            </div>

            <div className={style.content}>
              <div className={style.userconn}>
                <p className={style.username}>{e.username}</p>
                <MdDeleteOutline className={style.delete} onClick={() => deleteComment(e._id)} />
              </div>
              <h4 className={style.body}>{e.content}</h4>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Comment