// components
import Wrapper from 'components/header/Wrapper'
import Layout, { AutoLayout } from 'components/header/Layout'
import Logo from 'components/header/Logo'
import ControlBtn from 'components/header/ControlBtn'

const Header = ({
  onNavToggle, 
  onOptionToggle, 
  onLearningToggle,
  onTTSToggle // TTS 함수 추가
}: Props) => {
  return (
    <Wrapper>
      <Layout>
        <AutoLayout>
          <Logo />
          <div>
          <ControlBtn message="음성으로 듣기" onClick={onTTSToggle || (() => {})} />
            <ControlBtn message="Contents" onClick={onNavToggle} />
            <ControlBtn message="Setting" onClick={onOptionToggle} />
            <ControlBtn message="Highlights" onClick={onLearningToggle} />
          </div>
        </AutoLayout>
      </Layout>
    </Wrapper>
  );
}

interface Props {
  onNavToggle: (value?: boolean) => void;
  onOptionToggle: (value?: boolean) => void;
  onLearningToggle: (value?: boolean) => void;
  onTTSToggle?: () => void | Promise<void>; // TTS 함수 타입 추가
}

export default Header