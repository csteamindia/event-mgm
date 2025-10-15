import React from "react"
import { Container, Row, Col } from "reactstrap"

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <Col className="text-sm-end d-none d-sm-block" md={12}>{new Date().getFullYear()} © Catchysystem Technologies Pvt. Ltd.</Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  )
}

export default Footer
