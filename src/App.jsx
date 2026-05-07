import './App.scss';
import { useSelector } from 'react-redux';
import RoomType from './components/RoomType';
import Materials from './components/Materials';
import Summary from './components/Summary';
import AISummary from './components/AISummary';

const App = () => {
  const roomSelected = useSelector((state) => state.roomscontain.roomSelected);
  const aiGenerated  = useSelector((state) => state.roomscontain.aiGenerated);

  return (
    <>
        <div className="navbar bg-base-100 shadow-sm">
            <img
                className="w-full max-w-[100px]"
                src="https://www.feeldx.com/front/images/logo.png"
                alt="FeelDx"
            />
        </div>

        <div className="prog-bar">
            <div className="prog-in">
                <div className={`ps ${roomSelected ? 'done' : 'active'}`}>
                    <div className="pn">1</div><span>Choose Room</span>
                </div>
                <div className={`ps ${aiGenerated ? 'done' : roomSelected ? 'active' : ''}`}>
                    <div className="pn">2</div><span>Select Materials</span>
                </div>
                <div className={`ps ${aiGenerated ? 'done' : ''}`}>
                    <div className="pn">3</div><span>AI Analysis</span>
                </div>
            </div>
        </div>

        <div className="main">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-12 gap-4">

                    <div className="col-span-12 lg:col-span-8 order-last lg:order-first">
                        <RoomType />
                        <Materials />
                    </div>

                    <div className="col-span-12 lg:col-span-4 order-first lg:order-last">
                        <Summary />
                        <AISummary />
                    </div>

                </div>
            </div>
        </div>
    </>
  );
};

export default App;
