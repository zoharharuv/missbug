const { Link } = ReactRouterDOM
export function Navbar({ user, onLogout }) {
    return (
        <header className="nav-bar">
            <h1 className="logo">Miss Bug</h1>
            {user && <div className="nav-bar-middle">
                <h1>Welcome {user.fullname}</h1>
            </div>}
            <div className="nav-bar-end">
                <Link to="/">Home</Link>
                {user &&
                    <div className="user-actions">
                        <Link to={`/user/${user._id}`} >Your Profile</Link>
                        {user.is_admin && <Link to='/admin/usertable' >User table</Link>}
                        <button onClick={onLogout}>Logout</button>
                    </div>
                }
            </div>
        </header>
    )
}