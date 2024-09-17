import styled from "styled-components/native";
import { Container,LoadingIndicator  } from "../../screens/Login/styles";

export const Container = styled.View`

flex: 1;
justify-content: center;
align-items: center;

background-color: ${({ theme}) => theme.COLORS.GRAY_600};
`;

export const LoadingIndicator = styled.ActivityIndicator.attrs(({theme})=>({
    color: theme.COLORS.BRIGHT_BLUE
}))``;