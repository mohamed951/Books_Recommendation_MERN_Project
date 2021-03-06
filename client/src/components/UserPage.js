import React, { Component } from 'react';
// import { TabContent, TabPane, Nav ,  Row, Col } from 'reactstrap';
// import classnames from 'classnames';
import TableComp from './TableComp';
// import AddItemComp from './AddItemComp';
import {CategoryContext} from '../contexts/CategoryContext';
// import {Tab , NavItem ,TabContainer,Container,Item, Nav ,Sonnet, Pane, Link,Content,NavLink , classnames , Row , Col}  from 'react-bootstrap/Tab'
import {redirectTo,navigate} from "@reach/router"
import BookTable from '../components/books/BookTable';
import {Tab,Tabs,Nav,Col,Row} from 'react-bootstrap';
import NavbarUser from '../components/NavbarUser';

//img
const base64Flag = 'data:image/jpeg;base64,';
const books=[{
  _id:"1",
  photo : "photo A",
  name : "BOOK A",
  author : "Authror A",
  avg_rate : "33",
  rating : "4",
  Shelve : "read"
}];
class UserPage extends Component {
  state = {
    cols : ["photo","name","author","avg_rate","rating","book_status"],
    Allbooks : [],
    Readbooks : [],
    Currentbooks : [],
    Wantbooks : []
  };

  loadBook=()=>{
    console.log("Fetching")
    fetch('http://localhost:5000/users/5c77e28567450923277413ae/book', {
      method: 'GET'
    }).then((response) => response.json())
    .then((responseJson) => {
      this.setState(
        {Allbooks : responseJson.books});
        console.log(this.state.Allbooks);
        this.getBookStatus();
    }).catch((error) =>{
      console.log(error);
    });
  }

  getBookStatus(){
    let arr_status =[];
    // switch(book_status) {
    //   case "Read":
        arr_status = this.state.Allbooks.filter( book => book.book_status === 'read' );
        this.setState({Readbooks: arr_status});
        arr_status=[];
      //   break;
      // case "Currently Reading":
        arr_status = this.state.Allbooks.filter( book => book.book_status === 'Currently Reading');
        this.setState({Currentbooks: arr_status});
        arr_status=[];
      //   break;
      // case "Want To Read":
        arr_status = this.state.Allbooks.filter( book => book.book_status === 'Want To Read');
        this.setState({Wantbooks: arr_status});
        arr_status=[];
      //   break;
      // default:
  }

  arrayBufferToBase64(buffer) {
  var binary = '';
  var bytes = [].slice.call(new Uint8Array(buffer));
  bytes.forEach((b) => binary += String.fromCharCode(b));
  return window.btoa(binary);
  };

  componentWillMount(){
    
    //   this.loadBook();
//     this.loadCat();
//     this.loadAuth();
  }
  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
    this.loadBook();
  }
  
  render() {
    const token = localStorage.getItem("jwttoken");
    console.log(token)
      if(token!== 'undefined'&&token!== null){
        
      }
      else {
        console.log("rediredt to /")
      window.location.href = "/";//navigate("/")
      return null;
      }
    return (
        <div>
          <div><NavbarUser/></div>
          <div className="container">
          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Row>
              <Col sm={3}>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="first">All</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="second">Read</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="third">Currently Reading</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="fourth">Want To Read</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    <BookTable cols={this.state.cols} rows={this.state.Allbooks}></BookTable>
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    <BookTable cols={this.state.cols} rows={this.state.Readbooks}></BookTable>
                  </Tab.Pane>
                  <Tab.Pane eventKey="third">
                    <BookTable cols={this.state.cols} rows={this.state.Currentbooks}></BookTable>
                  </Tab.Pane>
                  <Tab.Pane eventKey="fourth">
                    <BookTable cols={this.state.cols} rows={this.state.Wantbooks}></BookTable>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
          </div>
      </div> 
    );
  }
}

export default UserPage;