import styled from "styled-components/native";
import { Container,LoadingIndicator  } from "../../screens/Login/styles";
import Colors from "../../constants/Colors";

export const Container = styled.View`

flex: 1;
justify-content: center;
align-items: center;

background-color: ${Colors.COLORS.GRAY_600};
`;

export const LoadingIndicator = styled.ActivityIndicator.attrs(({theme})=>({
    color: theme.COLORS.BRIGHT_BLUE
}))``;