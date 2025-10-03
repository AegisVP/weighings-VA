import { Loader } from 'components/Loader/Loader';
import { StyledButton } from 'components/LoginForm/LoginForm.styled';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from 'redux/actions';
import { selectUserInfo, selectUserIsLoading, selectUserIsLoggedIn } from 'redux/selectors';
import { AuthLinks, HeaderBarSection, HeaderWrapper, NavLinkStyled, NavWrapper } from './HeaderBar.styled';

export const HeaderBar = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectUserIsLoggedIn);
  const isLoading = useSelector(selectUserIsLoading);
  const user = useSelector(selectUserInfo);

  const logoutHandler = () => {
    dispatch(logoutUser());
  };

  return (
    isLoggedIn && (
      <HeaderBarSection>
        <HeaderWrapper>
          <NavWrapper>
            <NavLinkStyled to="weighings">Зважування</NavLinkStyled>
            <NavLinkStyled to="reports">Звітність</NavLinkStyled>
          </NavWrapper>
          <AuthLinks>
            <span>{user.name}</span>
            <StyledButton onClick={logoutHandler} disabled={isLoading}>
              {isLoading ? <Loader style={{ width: '24px', height: '24px' }} /> : 'Вихід'}
            </StyledButton>
          </AuthLinks>
        </HeaderWrapper>
      </HeaderBarSection>
    )
  );
};
