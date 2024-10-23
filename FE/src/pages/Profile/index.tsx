import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import imageDuc from '../../assets/images/avatar-duc.jpg';
import imageThang from '../../assets/images/avatar-thang.jpg'
const Profile: React.FC = () => {
    return (
        <div className="container-fluid">
            <div className="profile-cards">
                {/* Profile Card 1 */}
                <div className="profile-card">
                    <div className="d-flex flex-column align-items-center">

                        <img
                            src={imageDuc}
                            alt="Profile"
                            className="profile-img"
                        />
                        <h2 className="name">Nguyễn Trọng Đức</h2>
                        <p className="title">D21HTTT06 <strong>PTIT</strong></p>
                        <p className="email">Email: <strong >tduczero178@gmail.com</strong></p>
                        <div className="info">
                            <p className="info-item"><strong>B21DCCN252</strong><br />Mã sinh viên</p>
                            <p className="info-item"><strong>0862158106</strong><br />Số điện thoại</p>
                        </div>
                        <div className="d-flex">
                            <a href="https://drive.google.com/drive/u/0/folders/1qOC_Twtd-dVcXXZzsPNTAia6TJ63EmlE" target="_blank" className="facebook" rel="noopener noreferrer" >
                                <i className="fas fa-file-word" style={{ fontSize: '40px', marginRight: '16px' }}></i>
                            </a>
                            <a href="https://drive.google.com/drive/u/0/folders/1qOC_Twtd-dVcXXZzsPNTAia6TJ63EmlE" target="_blank" className="instagram" rel="noopener noreferrer">
                                <i className="fas fa-file-code" style={{ fontSize: '40px', marginRight: '16px' }}></i>
                            </a>
                            <a href="https://github.com/ZDUC" target="_blank" className="github" rel="noopener noreferrer">
                                <i className="fab fa-github" style={{ fontSize: '40px' }}></i>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Profile Card 2 */}
                <div className="profile-card">
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        <img
                            src={imageThang}
                            alt="Profile"
                            className="profile-img"
                        />
                        <h2 className="name">Phạm Ngọc Thắng</h2>
                        <p className="title">D21HTTT06 <strong>PTIT</strong></p>
                        <p className="email" style={{ wordBreak: 'break-word' }}>Email: <strong>thangpham19032003@gmail.com</strong></p>
                        <div className="info">
                            <p className="info-item"><strong>B21DCCN672</strong><br />Mã sinh viên</p>
                            <p className="info-item"><strong>0922128688</strong><br />Số điện thoại</p>
                        </div>
                        <div className="d-flex">
                            <a href="https://drive.google.com/drive/u/0/folders/1qOC_Twtd-dVcXXZzsPNTAia6TJ63EmlE" target="_blank" className="facebook" rel="noopener noreferrer">
                                <i className="fas fa-file-word" style={{ fontSize: '40px', marginRight: '16px' }}></i>
                            </a>
                            <a href="https://drive.google.com/drive/u/0/folders/1qOC_Twtd-dVcXXZzsPNTAia6TJ63EmlE" target="_blank" className="instagram" rel="noopener noreferrer">
                                <i className="fas fa-file-code" style={{ fontSize: '40px', marginRight: '16px' }}></i>
                            </a>
                            <a href="https://github.com/ThangPtit193" target="_blank" className="github" rel="noopener noreferrer">
                                <i className="fab fa-github" style={{ fontSize: '40px', marginRight: '16px' }}></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
