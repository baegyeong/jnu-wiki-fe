
import styled from "styled-components";
import Request from "./Request";
import Title from "../Resister/Title";

const RequestContain = ({border,datas}) => {
    console.log(datas)
    return (
        <RequestContainCss border={border}>
            {datas.length>0 ?
                    datas.map((data) =>
                        (<Request key={data.id} data={data} />)
                    )
                    : <Title margin='10rem 0 0 5rem'  fontSize='17px'>요청이 들어오지 않았네요 :(</Title>}
                    {/* Title 추후 위치 수정 */}
        </RequestContainCss>
    );
};
const RequestContainCss= styled.div`
    display: flex;
    flex-direction: column;
    height: 22rem;
   
    border-right: ${props => props? props.border : null }; 
    overflow: scroll;
  
`;

export default RequestContain;