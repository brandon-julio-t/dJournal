// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract JournalContractImplV1 {
    struct Journal {
        string title;
        string body;
        bool isInitialized;
        uint createdAt;
        uint updatedAt;
        uint deletedAt;
    }

    mapping(address => Journal[]) public journalDb;

    function createJournal(
        string calldata title,
        string calldata body
    ) public virtual {
        Journal memory newJournal = Journal({
            title: title,
            body: body,
            isInitialized: true,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            deletedAt: 0
        });

        journalDb[msg.sender].push(newJournal);
    }

    function getMyJournals() public view returns (Journal[] memory) {
        return journalDb[msg.sender];
    }

    function updateJournal(
        uint id,
        string calldata title,
        string calldata body
    ) public virtual {
        require(isValidId(id), "Invalid ID");

        Journal storage existing = journalDb[msg.sender][id];

        (bool ok, string memory reason) = isValidJournal(existing);
        require(ok, reason);

        existing.title = title;
        existing.body = body;
        existing.updatedAt = block.timestamp;
    }

    function deleteJournal(uint id) public virtual {
        require(isValidId(id), "Invalid ID");

        Journal storage existing = journalDb[msg.sender][id];

        (bool ok, string memory reason) = isValidJournal(existing);
        require(ok, reason);

        existing.updatedAt = block.timestamp;
        existing.deletedAt = block.timestamp;
    }

    function isValidId(uint id) private view returns (bool) {
        return id >= 0 && id < journalDb[msg.sender].length;
    }

    function isValidJournal(
        Journal storage journal
    ) private view returns (bool, string memory) {
        if (!journal.isInitialized) {
            return (false, "Uninitialized journal");
        }

        if (journal.deletedAt != 0) {
            return (false, "Journal is deleted");
        }

        return (true, "");
    }

    function version() public pure virtual returns (string memory) {
        return "v1";
    }
}
