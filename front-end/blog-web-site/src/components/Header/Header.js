import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './Header.css';

const Header =  () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    console.log("User Role : ", userRole)

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.replace('/');
    };

    if (!token) {
        return (
            <Navbar className='custom-navbar' variant='dark' fixed='top'>
                <Container>
                    <Nav className="me-auto">
                        <Nav.Link className='link' href='/'> PublishedBlogs </Nav.Link>
                        <Nav.Link className='link' href="/LogIn"> LogIn </Nav.Link>
                        <Nav.Link className='link' href="/Registration">Registration</Nav.Link>
                    </Nav >
                </Container>
            </Navbar>
        );
    } else {
        if (userRole == 2) {
            return (
                <Navbar className='custom-navbar' variant='dark' fixed='top'>
                    <Container>
                        <Nav className="me-auto">
                            <Nav.Link href="/User/PublishedBlog"> Blogs </Nav.Link>
                            <Nav.Link href="/User/AddBlog"> AddBlog </Nav.Link>
                            <Nav.Link href="/User/BlogRequest"> BlogRequest </Nav.Link>
                            <Nav.Link href="/User/BlogRejected"> BlogRejected </Nav.Link>
                            <Nav>
                                <Nav.Link onClick={handleLogout}>LogOut</Nav.Link>
                            </Nav>
                        </Nav>
                    </Container>
                </Navbar>
            );

        } else {
            return (
                <Navbar className='custom-navbar' variant='dark' fixed='top'>
                    <Container>
                        <Nav className="me-auto">
                            <Nav.Link href="/Admin/PublishedBlog"> PublishedBlogs </Nav.Link>
                            <Nav.Link href="/Admin/BlogRequest"> BlogRequest </Nav.Link>
                            <Nav.Link href="/Admin/BlogReject"> BlogRejected </Nav.Link>
                            <Nav.Link href='/ActiveUser'> ActiveUser </Nav.Link>
                            <Nav.Link href='/InactiveUser'>InactiveUser</Nav.Link>
                            <Nav>
                                <Nav.Link onClick={handleLogout}>LogOut</Nav.Link>
                            </Nav>
                        </Nav>
                    </Container>
                </Navbar>
            );
        }
    }
}

export default Header;
