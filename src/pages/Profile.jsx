import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { user } = useAuth();
  const row = (l, v) => (<div className="detail-row"><span className="detail-label">{l}</span><div>{v}</div></div>);
  return (
    <>
      <h1>Profile</h1>
      <div className="card details">
        {row('Name', user.name)}
        {row('Email', user.email)}
        {row('Roll Number', user.rollNumber)}
        {row('Department', user.department)}
      </div>
    </>
  );
}
