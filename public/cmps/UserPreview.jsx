export function UserPreview({ user }) {
    return <article className="user-preview">
        <div className="preview-header">
            <i className="user-profile-icon fa-solid fa-circle-user"></i>
            <h3 className="username">{user.username}</h3>
        </div>
        {user.fullname && <p className="fullname">Full name: {user.fullname}</p>}
    </article>
}