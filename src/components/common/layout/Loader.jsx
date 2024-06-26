import styled from "styled-components";

const Container = styled.section`
  .load-wrap {
    float: left;
    height: 100px;
    border-radius: 5px;
    text-align: center;
  }

  .load-wrap:last-child {
    margin-right: 0;
  }

  .line {
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 15px;
    background-color: #216d32;
    margin: 0.5rem;
  }

  .load-3 .line:nth-last-child(1) {
    animation: loadingC 0.6s 0.1s linear infinite;
  }

  .load-3 .line:nth-last-child(2) {
    animation: loadingC 0.6s 0.2s linear infinite;
  }

  .load-3 .line:nth-last-child(3) {
    animation: loadingC 0.6s 0.3s linear infinite;
  }

  @keyframes loadingC {
    0% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(0, 15px);
    }
    100% {
      transform: translate(0, 0);
    }
  }
`;

const Loader = ({ className }) => {
  return (
    <Container className={className}>
      <section className="load-wrap">
        <section className="load-3">
          <section className="line"></section>
          <section className="line"></section>
          <section className="line"></section>
        </section>
      </section>
    </Container>
  );
};

export default Loader;
