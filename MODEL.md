Basic data model should be something like:

  - User Id (available in cookie, elsewhere? shouldn't need to know it)
  - Connections (new /connections endpoint?)
    1. Connection
      - Config (available in /status)
      - Id (from /connections)
      - Nick (assume it matches Config.Nick, changes come from NICK event)
      - Channels (assume empty, create on JOIN events)
        1. Channel
          - Name (part of JOIN event)
          - Nicks (arrives as 353 events after JOIN)
          - Topic (arrives as 332 and 333 events after JOIN)
            - String
            - Author
            - Time
      - Private messages
        1. Private message
          - Name (name of other person?)
