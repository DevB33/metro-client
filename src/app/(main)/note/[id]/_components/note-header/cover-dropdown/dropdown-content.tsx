import { css, cva } from '@/../styled-system/css';

interface ICoverDropdownContentProps {
  handleSelectCover: (color: string) => void;
  handleCoverModalClose: () => void;
}

const dropDownContentContainer = css({
  display: 'flex',
  flexDirection: 'column',
  height: 'auto',
  overflowY: 'scroll',
  px: 'small',
  py: 'tiny',
});

const imageDescription = css({
  height: '1.25rem',
  fontSize: '0.9rem',
  color: 'grey',
  my: '0.5rem',
});

const imageContainer = css({
  height: 'auto',
  flexWrap: 'wrap',
  display: 'flex',
  flexDirection: 'row',
  gap: 'tiny',
});

const image = css({
  width: '7.5rem',
  height: '4rem',
  backgroundColor: 'gray',
  borderRadius: 'sm',
});

const DropdownContent = ({
  handleSelectCover,
  handleCoverModalClose,
}: ICoverDropdownContentProps) => {
  const colorCategories = [
    {
      title: '레드 계열',
      colors: [
        '#ff0000', // 빨간색 (쨍한 빨강)
        '#ff66b3', // 연한 자홍
        '#ffb3b3', // 연한 붉은색
        '#ffcccc', // 연한 빨강
      ],
    },
    {
      title: '오렌지 계열',
      colors: [
        '#ff6600', // 오렌지색 (쨍한 오렌지)
        '#ffcc99', // 연한 주황
        '#ffecb3', // 연한 황금빛 노랑
      ],
    },
    {
      title: '옐로우 계열',
      colors: [
        '#ffcc00', // 노란색 (쨍한 노랑)
        '#ffff99', // 연한 노랑
        '#ffffcc', // 연한 밝은 노랑
      ],
    },
    {
      title: '그린 계열',
      colors: [
        '#00cc00', // 초록색 (쨍한 초록)
        '#b3e64d', // 연한 라임
        '#c5e1a5', // 연한 올리브그린
        '#ccffcc', // 연한 초록
        '#f0f4c3', // 연한 올리브색
      ],
    },
    {
      title: '블루 계열',
      colors: [
        '#0066cc', // 파란색 (쨍한 파랑)
        '#99ccff', // 연한 파랑
        '#b2ebf2', // 연한 파스텔블루
        '#d6eaf8', // 연한 하늘색
      ],
    },
    {
      title: '퍼플 계열',
      colors: [
        '#800080', // 보라색 (쨍한 보라)
        '#cc99ff', // 연한 보라색
        '#e0aaff', // 연한 보라
        '#d1c4e9', // 연한 라벤더퍼플
      ],
    },
    {
      title: '핑크 계열',
      colors: [
        '#ff3399', // 핑크색 (쨍한 핑크)
        '#f8bbd0', // 연한 라벤더
        '#ffb3d9', // 연한 핑크
        '#ffccf2', // 연한 라이트핑크
      ],
    },
    {
      title: '브라운 계열',
      colors: [
        '#804000', // 갈색 (쨍한 갈색)
        '#d9b38c', // 연한 갈색
      ],
    },
    {
      title: '회색 계열',
      colors: [
        '#808080', // 회색 (쨍한 회색)
        '#d9d9d9', // 연한 회색
        '#e3f2f1', // 연한 민트색
      ],
    },
    {
      title: '민트/청록 계열',
      colors: [
        '#00cccc', // 청록색 (쨍한 청록)
        '#99e6e6', // 연한 청록
        '#c0f2e1', // 연한 민트블루
      ],
    },
  ];

  const handleClick = (color: string) => {
    handleSelectCover(color);
    handleCoverModalClose();
  };

  return (
    <div className={dropDownContentContainer}>
      {colorCategories.map(category => (
        <div key={category.title}>
          <div className={imageDescription}>{category.title}</div>
          <div className={imageContainer}>
            {category.colors.map(color => (
              <button
                type="button"
                key={color}
                className={image}
                style={{ backgroundColor: color }}
                onClick={() => handleClick(color)}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DropdownContent;
