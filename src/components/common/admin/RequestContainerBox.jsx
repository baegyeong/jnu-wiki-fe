import styled from "styled-components";
import TitleBox from '../admin/TitleBox'
import RequestContain from '../admin/RequestContain'

//prop 으로 data 넘겨주기...
const RequestContainerBox = ({title,border,data}) => {
    
    //const [data,setData]=useState() 데이터 요청한거 받아오기.
    return (
        <RequestContainerBoxCss>
        <TitleBox title={title} data={data}/>
        <RequestContain border={border} datas={data}/>
        </RequestContainerBoxCss>
    );
};

const RequestContainerBoxCss = styled.div`
    
    display: flex;
    flex-direction: column;
    
    `

export default RequestContainerBox;