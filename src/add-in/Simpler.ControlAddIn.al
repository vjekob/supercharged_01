controladdin Simpler
{
    Scripts =
        'src/add-in/scripts/numeral.min.js',
        'src/add-in/scripts/simpler.constants.js',
        'src/add-in/scripts/simpler.interface.js',
        'src/add-in/scripts/simpler.state.js',
        'src/add-in/scripts/simpler.ui.js';

    StartupScript = 'src/add-in/scripts/start.js';

    StyleSheets =
        'src/add-in/styles/simpler.core.css',
        'src/add-in/styles/simpler.data.css',
        'src/add-in/styles/simpler.entry.css',
        'src/add-in/styles/simpler.summary.css';

    RequestedHeight = 400;
    RequestedWidth = 600;
    MaximumHeight = 1200;
    MinimumHeight = 200;

    HorizontalShrink = false;
    HorizontalStretch = true;
    VerticalShrink = true;
    VerticalStretch = true;

    event OnControlReady();

    procedure SendData(Data: JsonArray);
}