import {Link} from 'react-router-dom'
export function BlogCard({post}){

    let date = new Date(post.dateCreated)
    let stringDate = date.toString()

    return (
        <Link to={`/readblog/${post._id}`} className="post-card animate-in">
            <span className="post-date">{stringDate.slice(4, 15)}</span>
            <h1>{post.title}</h1>
            <h2>{post.description}</h2>
            <div style={{marginTop: 'auto', fontWeight: 600, color: 'var(--accent)', fontSize: '14px'}}>
                Read More →
            </div>
        </Link>
    )
}